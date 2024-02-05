<template>
	<q-table
		:rows="rows"
		:columns="columns"
		flat
		bordered
		class="simple-table"
		:filter="search"
		separator="vertical"
		:loading="loading"
		color="primary"
		virtual-scroll
		:rows-per-page-options="[0]"
	>
		<template #body="props">
			<q-tr :props="props">
				<q-td v-for="col in props.cols" :key="col.name" :props="props">
					<div v-if="col.field === 'actions'" class="row justify-center">
						<ButtonEdit
							class="q-mr-md"
							style="width: 10px"
							@click="onUpdate(props.rowIndex)"
						/>
						<router-link
							v-if="$route.path === '/contracts'"
							:to="{
								name: 'BillTo',
								params: { contractId: props.row._id },
							}"
						>
							<ButtonBill />
						</router-link>
					</div>
					<span v-else-if="amountLables.includes(col.label)">
						{{ formatPrice(col.value) }}
					</span>
					<span v-else-if="col.label === 'Invoice Number'">
						<a :href="props.row.pdfLink" target="_blank">
							{{ col.value }}
						</a>
						<a
							:href="props.row.pdfLink"
							target="_blank"
							style="text-decoration: none"
						>
							<q-icon name="open_in_new" size="xs" />
						</a>
					</span>
					<span v-else-if="name === 'invoices' && col.label === 'Status'">
						{{
							props.row.amountPaid >= props.row.invoiceAmount
								? 'Paid'
								: 'Not Yet Paid'
						}}
					</span>
					<span v-else>
						{{ col.value }}
					</span>
				</q-td>
			</q-tr>
		</template>
	</q-table>
</template>

<script>
import { mapMutations } from 'vuex';
import { defineAsyncComponent } from 'vue';
import { useDialog } from '@/helpers/common';
import { priceFormatter } from '@/helpers/common';
export default {
	components: {
		ButtonEdit: defineAsyncComponent(() =>
			import('@/components/buttons/ButtonEdit')
		),
		ButtonBill: defineAsyncComponent(() =>
			import('@/components/buttons/ButtonBill')
		),
	},
	props: {
		name: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},

		search: {
			type: String,
			default: '',
		},
		rows: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		currentUpdatedocId: '',
		isShowDialog: false,
		updateIndex: -1,
		amountLables: ['Contract Amount', 'Amount Paid', 'Invoice Amount'],
	}),
	computed: {
		dialog() {
			return useDialog(this.columns, this.rows, this.updateIndex);
		},
	},
	methods: {
		...mapMutations({
			setDialogDocId: 'popUpDialog/SET_DOC_ID',
			setDialogName: 'popUpDialog/SET_NAME',
			setDialogShow: 'popUpDialog/SET_SHOW',
			setDialogFields: 'popUpDialog/SET_FIELDS',
			setDialogActions: 'popUpDialog/SET_ACTIONS',
			setDialogTitle: 'popUpDialog/SET_TITLE',
		}),
		onUpdate(updateIndex) {
			this.updateIndex = updateIndex;
			this.setDialogDocId(this.rows[updateIndex]._id);
			this.setDialogName(this.name);
			this.setDialogFields(this.dialog.fields);
			this.setDialogActions(['Cancel', 'Update']);
			let title;
			if (this.name === 'clients') title = `Edit client`;
			if (this.name === 'contracts') title = `Edit contract`;
			this.setDialogTitle(title);
			this.setDialogShow(true);
		},
		formatPrice: priceFormatter,
	},
};
</script>

<style lang="scss">
.simple-table {
	.q-table__top,
	th {
		background-color: #f0f0f0;
	}
}
</style>
