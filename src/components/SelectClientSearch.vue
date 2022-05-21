<template>
	<q-select
		outlined
		:model-value="value"
		use-input
		input-debounce="0"
		:options="clientsFound"
		:behavior="$q.platform.is.ios ? 'dialog' : 'menu'"
		@filter="onFilter"
		@update:model-value="onSelectClient"
		clearable
		no-error-icon
		:rules="[(val) => !!val || 'Field is required']"
	>
		<template #no-option>
			<q-item>
				<q-item-section class="text-grey"> No Cients </q-item-section>
			</q-item>
		</template>
		<template #option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section>
					<q-item-label>{{ scope.opt.name }}</q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: '',
		},
		clients: {
			type: Array,
			default: () => [],
		},
	},
	emits: {
		selectedClient: {
			type: Object,
			default: () => {},
		},
	},
	data: () => ({
		clientsFound: [],
	}),
	methods: {
		onSelectClient(client) {
			this.$emit('selectedClient', client);
		},
		onFilter(val, update) {
			if (val.trim() === '') {
				update(() => {
					this.clientsFound = this.clients;
				});
				return;
			}

			update(() => {
				const needle = val.toLowerCase();
				this.clientsFound = this.clients.filter(
					(v) => v['name'].toLowerCase().indexOf(needle) > -1
				);
			});
		},
	},
};
</script>

<style></style>
