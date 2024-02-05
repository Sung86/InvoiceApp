<template>
	<q-dialog v-model="isShow">
		<q-card style="min-width: 50%" class="q-px-md">
			<q-card-section>
				<div class="text-h6 text-center">{{ title }}</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				<div v-for="(field, index) in dataFields" :key="index" class="q-mb-md">
					<div style="display: inline-block">{{ field.label }}</div>
					<SelectClientSearch
						v-if="
							name === 'contracts' &&
							field.label === 'Client Name' &&
							field.editable
						"
						:clients="clients"
						:value="field.value"
						@selectedClient="onSelectedClient($event, field)"
					/>
					<q-input
						v-else-if="field.editable"
						v-model="field.value"
						:prefix="amountLabels.includes(field.label) ? '$' : ''"
						outlined
						no-error-icon
						type="text"
						:disable="currentAction !== ''"
						:rules="[(val) => !!val || 'Field is required']"
					/>
					<span v-else-if="name === 'invoices' && field.label === 'Status'">
						:
						{{ renderStatus() }}
					</span>
					<span v-else>: {{ field.value }}</span>
				</div>
			</q-card-section>

			<q-card-actions align="right" class="text-primary">
				<q-btn
					v-for="action in actions"
					:key="action"
					:disabled="currentAction !== '' && action === 'Cancel'"
					:loading="currentAction === action"
					flat
					:label="action"
					class="text-capitalize"
					@click="onAction(action)"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { updateData, addData, createDocReference } from '@/apis/firestore';
import { generateContractNumber } from '@/helpers/common';
import { defineAsyncComponent } from 'vue';
export default {
	components: {
		SelectClientSearch: defineAsyncComponent(() =>
			import('@/components/SelectClientSearch')
		),
	},
	data: () => ({
		dataFields: [],
		amountLabels: ['Contract Amount', 'Amount Paid'],
		currentAction: '',
		selectedClientDocId: '',
		isShow: false,
	}),
	computed: {
		...mapGetters({
			docId: 'popUpDialog/getDocId',
			name: 'popUpDialog/getName',
			title: 'popUpDialog/getTitle',
			show: 'popUpDialog/getShow',
			fields: 'popUpDialog/getFields',
			actions: 'popUpDialog/getActions',
			clients: 'simpleTable/getClients',
		}),
	},
	watch: {
		show(isShow) {
			if (isShow) {
				this.dataFields = JSON.parse(JSON.stringify(this.fields));
			} else {
				this.setFields([]);
				this.dataFields = [];
			}
			this.isShow = isShow;
		},
		isShow() {
			this.setShow(this.isShow);
		},
	},
	created() {
		if (this.clients.length <= 0) this.loadClients();
	},
	mounted() {
		this.dataFields = JSON.parse(JSON.stringify(this.fields));
	},
	methods: {
		...mapActions({
			updateTableData: 'simpleTable/updateData',
			addTableData: 'simpleTable/addData',
			loadClients: 'simpleTable/loadClients',
		}),
		...mapMutations({
			setShow: 'popUpDialog/SET_SHOW',
			setFields: 'popUpDialog/SET_FIELDS',
		}),
		onSelectedClient(client, field) {
			field.value = client?.name;
			this.selectedClientDocId = client?._id;
		},
		async onAction(action) {
			this.currentAction = action;
			const actions = {
				update: () => this.onUpdate(),
				create: () => this.onCreate(),
			};

			const notificationOptions = {
				type: 'positive',
				message: `Successfully ${action}d`,
				position: 'top',
			};

			const invalidFields = this.dataFields.filter((f) => !f.value);
			if (this.currentAction !== 'Cancel' && invalidFields.length <= 0) {
				const isSuccess = await actions[action.toString().toLowerCase()]();
				if (!isSuccess) {
					notificationOptions.type = 'negative';
					notificationOptions.message = 'Opps, something went wrong...';
				}
			}

			if (invalidFields.length > 0) {
				notificationOptions.type = 'warning';
				notificationOptions.message = 'Please fill in all required fields';
			}

			if (this.currentAction !== 'Cancel') this.$q.notify(notificationOptions);
			else this.setShow(false);
			this.currentAction = '';
		},
		renderStatus() {
			const status =
				this.dataFields[4].value >= this.dataFields[3].value
					? 'Paid'
					: 'Not Yet Paid';
			this.dataFields[1].value = status;
			return status;
		},
		async onCreate() {
			const data = {};
			this.dataFields.forEach((field) => {
				data[field.key] = field.value;
			});
			if (this.name === 'contracts') {
				data['contractNumber'] = await generateContractNumber();
				data['clientRef'] = await createDocReference(
					`clients/${this.selectedClientDocId}`
				);
			}
			let clientName;
			if (this.name === 'contracts') {
				clientName = data['clientName'];
				delete data['clientName'];
			}
			const res = await addData(this.name, data);
			if (res.status) {
				if (this.name === 'contracts') {
					data['clientName'] = clientName;
					delete data['clientRef'];
				}
				const newData = {
					...data,
					_id: res.docId,
				};
				if (this.name === 'clients') newData['clientId'] = res.docId;

				this.addTableData({
					tableName: this.name,
					data: newData,
				});
			}
			return res.status;
		},
		async onUpdate() {
			const editableFields = this.dataFields.filter((f) => f.editable);
			const data = {};
			editableFields.forEach((f) => {
				data[f.key] = f.value;
			});

			const res = await updateData(this.name, this.docId, data);
			if (res.status) {
				this.updateTableData({
					tableName: this.name,
					data: { ...data, _id: this.docId },
				});
			}
			return res.status;
		},
	},
};
</script>
