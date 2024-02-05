<template>
	<div class="q-pa-xl">
		<div class="text-h5 text-weight-bold">Clients</div>
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
			name="clients"
			:search="search"
			:rows="getClients"
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
		rows: [],
		tableHeaders: [
			{
				name: 'clientId',
				label: 'Client ID',
				editable: false,
			},
			{
				name: 'name',
				label: 'Client Name',
				editable: true,
			},
			{
				name: 'abn',
				label: 'ABN',
				editable: true,
			},
			{
				name: 'email',
				label: 'Email',
				editable: true,
			},
		],
	}),
	computed: {
		...mapGetters({
			getClients: 'simpleTable/getClients',
		}),
		columns() {
			return useTableHeaders(this.tableHeaders);
		},
	},
	async created() {
		this.isLoading = true;
		await this.loadClients();
		this.isLoading = false;
	},
	methods: {
		...mapActions({
			loadClients: 'simpleTable/loadClients',
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
			const labels = this.columns.filter((col) => col.name !== 'clientId');
			const dialog = useDialog(labels, null, null, 'create');
			this.setDialogFields(dialog.fields);
			this.setDialogName('clients');
			this.setDialogActions(['Cancel', 'Create']);
			this.setDialogShow(true);
			this.setDialogTitle('Create client');
		},
	},
};
</script>
