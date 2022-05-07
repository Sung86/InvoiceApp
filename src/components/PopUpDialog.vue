<template>
	<q-dialog :model-value="true">
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
						outlined
						no-error-icon
						type="text"
						:disable="currentAction !== ''"
						:rules="[(val) => !!val || 'Field is required']"
					/>
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
		currentAction: '',
		selectedClientDocId: '',
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
			this.dataFields = isShow ? JSON.parse(JSON.stringify(this.fields)) : [];
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
		}),
		onSelectedClient(client, field) {
			field.value = client.name;
			this.selectedClientDocId = client._id;
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

			const invalidFields = this.dataFields.filter(
				(f) => f.value.trim() === ''
			);
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
			const res = await addData(this.name, data);
			if (res.state) {
				if (this.name === 'contracts') delete data['clientRef'];
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
			return res.state;
		},
		async onUpdate() {
			let keys = [];
			if (this.name === 'clients') keys = ['name', 'abn', 'email'];
			if (this.name === 'contracts') keys = ['amount'];
			if (this.name === 'invoices') keys = ['amountPaid'];

			const data = {};
			keys.forEach((key) => {
				const field = this.dataFields.find((field) => field.key === key);
				data[key] = field.value;
			});

			const res = await updateData(this.name, this.docId, data);
			if (res.state) {
				this.updateTableData({
					tableName: this.name,
					data: { ...data, _id: this.docId },
				});
			}
			return res.state;
		},
	},
};
</script>
