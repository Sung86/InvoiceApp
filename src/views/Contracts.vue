<template>
	<div class="q-pa-xl">
		<div class="text-h5 text-weight-bold">Contracts</div>
		<div class="q-my-lg row justify-between align-items-center">
			<q-btn
				color="secondary"
				size="lg"
				label="Create"
				class="text-capitalize"
				@click="onOpenCreateDialog"
			/>
			<q-input v-model="search" outlined dense debounce="300" bg-color="white">
				<template #prepend>
					<q-icon name="search" />
				</template>
			</q-input>
		</div>
		<SimpleTable
			name="contracts"
			:search="search"
			:rows="getContracts"
			:columns="columns"
			:loading="isLoading"
		/>
	</div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { useDialog, useTableHeaders } from '@/helpers/common';
import { mapGetters, mapMutations, mapActions } from 'vuex';
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
				name: 'contractNumber',
				label: 'Contract Number',
				editable: false,
			},
			{
				name: 'clientName',
				label: 'Client Name',
				editable: false,
			},
			{
				name: 'projectName',
				label: 'Project Name',
				editable: true,
			},
			{
				name: 'amount',
				label: 'Contract Amount',
				editable: true,
			},
		],
	}),
	computed: {
		...mapGetters({
			getContracts: 'simpleTable/getContracts',
		}),
		columns() {
			return useTableHeaders(this.tableHeaders);
		},
	},
	async created() {
		this.isLoading = true;
		await this.loadContracts();
		this.isLoading = false;
	},
	methods: {
		...mapActions({
			loadContracts: 'simpleTable/loadContracts',
		}),
		...mapMutations({
			setDialogDocId: 'popUpDialog/SET_DOC_ID',
			setDialogName: 'popUpDialog/SET_NAME',
			setDialogShow: 'popUpDialog/SET_SHOW',
			setDialogFields: 'popUpDialog/SET_FIELDS',
			setDialogActions: 'popUpDialog/SET_ACTIONS',
			setDialogTitle: 'popUpDialog/SET_TITLE',
		}),
		onOpenCreateDialog() {
			this.setDialogDocId('');
			const labels = this.columns.filter(
				(col) => col.name !== 'contractNumber'
			);
			const dialog = useDialog(labels, null, null, 'create');
			this.setDialogFields(dialog.fields);
			this.setDialogName('contracts');
			this.setDialogActions(['Cancel', 'Create']);
			this.setDialogShow(true);
			this.setDialogTitle('Create contract');
		},
	},
};
</script>
