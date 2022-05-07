<template>
	<div class="q-pa-xl">
		<div class="text-h5 text-weight-bold">Invoices</div>
		<div class="q-my-lg row justify-between align-items-center">
			<q-btn
				color="secondary"
				size="lg"
				class="q-px-lg text-capitalize"
				label="Bill To"
				:to="{ path: '/billTo' }"
			/>
			<q-input v-model="search" outlined dense debounce="300" bg-color="white">
				<template #prepend>
					<q-icon name="search" />
				</template>
			</q-input>
		</div>
		<SimpleTable
			name="invoices"
			:search="search"
			:rows="getInvoices"
			:columns="columns"
			:dialog="dialog"
			:loading="isLoading"
			@updateIndex="updateIndex = $event"
		/>
	</div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { useDialog, useTableHeaders } from '@/helpers/common';
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		SimpleTable: defineAsyncComponent(() =>
			import('@/components/SimpleTable.vue')
		),
	},
	data: () => ({
		search: '',
		updateIndex: 0,
		isLoading: false,
		tableHeaders: [
			{
				name: 'invoiceNumber',
				label: 'Invoice Number',
				editable: false,
			},
			{
				name: 'clientName',
				label: 'Client Name',
				editable: false,
			},
			{
				name: 'invoiceAmount',
				label: 'Invoice Amount',
				editable: false,
			},
			{
				name: 'invoiceDate',
				label: 'Invoice Date',
				editable: false,
			},
			{
				name: 'amountPaid',
				label: 'Amount Paid',
				editable: true,
			},
		],
	}),
	computed: {
		...mapGetters({
			getInvoices: 'simpleTable/getInvoices',
		}),
		columns() {
			return useTableHeaders(this.tableHeaders);
		},
		dialog() {
			return useDialog(this.columns, this.getInvoices, this.updateIndex);
		},
	},
	async created() {
		this.isLoading = true;
		await this.loadInvoices();
		this.isLoading = false;
	},
	methods: {
		...mapActions({
			loadInvoices: 'simpleTable/loadInvoices',
		}),
	},
};
</script>
