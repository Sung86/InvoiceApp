<template>
	<q-header class="bg-white q-py-md">
		<q-toolbar>
			<q-btn
				flat
				round
				dense
				icon="menu"
				color="black"
				size="lg"
				@click="() => $emit('toggleSideBar')"
			/>
			<q-space />
			<div class="text-dark text-h5">Admin</div>
		</q-toolbar>
	</q-header>
</template>

<script>
export default {
	emits: {
		toggleSideBar: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style></style>
