<template>
	<q-table
		:rows="rows"
		:columns="columns"
		flat
		bordered
		class="table"
		:filter="search"
		separator="vertical"
		:loading="loading"
		color="primary"
		virtual-scroll
		rows-per-page-options="0"
	>
		<template #body="props">
			<q-tr :props="props">
				<q-td v-for="col in props.cols" :key="col.name" :props="props">
					<q-btn
						v-if="col.field === 'actions'"
						size="lg"
						color="secondary"
						label="编辑"
						@click="onUpdate(props.rowIndex)"
					/>
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
export default {
	props: {
		name: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		dialog: {
			type: Object,
			default: () => {},
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
	emits: {
		updateIndex: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		currentUpdatedocId: '',
		isShowDialog: false,
	}),
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
			this.setDialogDocId(this.rows[updateIndex]._id);
			this.setDialogName(this.name);
			this.setDialogFields(this.dialog.fields);
			this.setDialogActions(['Cancel', 'Update']);
			this.$emit('updateIndex', updateIndex);
			let title;
			if (this.name === 'clients') title = `编辑}客户`;
			if (this.name === 'contracts') title = `编辑合同`;
			this.setDialogTitle(title);
			this.setDialogShow(true);
		},
	},
};
</script>

<style lang="scss">
.table {
	.q-table__top,
	th {
		background-color: #f0f0f0;
	}
}
</style>
