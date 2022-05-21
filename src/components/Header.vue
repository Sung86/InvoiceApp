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
			<q-btn
				class="text-blue q-mx-sm"
				flat
				round
				icon="logout"
				@click="onSignOut()"
			>
				<q-tooltip anchor="bottom left" :offset="[0, 10]" class="text-h6">
					Sign Out
				</q-tooltip>
			</q-btn>
		</q-toolbar>
	</q-header>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	emits: {
		toggleSideBar: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		...mapActions({
			signOut: 'user/signOut',
		}),
		async onSignOut() {
			await this.signOut();
			this.$router.push({ path: '/login' });
		},
	},
};
</script>

<style></style>
