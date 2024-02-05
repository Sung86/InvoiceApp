<template>
	<q-drawer
		v-model="isShow"
		persistent
		show-if-above
		:breakpoint="0"
		:width="200"
		style="background-color: #668a81"
	>
		<div class="row justify-center items-center q-mt-lg">
			<q-avatar size="120px">
				<img src="@/assets/logo.png" />
			</q-avatar>
		</div>
		<div class="q-px-md column q-mt-xl">
			<q-card
				v-for="(navigation, index) in navigations"
				:key="index"
				class="cursor-pointer q-mb-lg"
				style="background-color: #f5eedc; border-radius: 20px; height: 110px"
				:style="{
					border: $route.path === navigation.path ? '2px solid blue' : 'none',
				}"
				flat
				align="center"
				@click="() => $router.push({ path: navigation.path })"
			>
				<q-card-section style="height: 100%">
					<q-icon :name="navigation.icon" size="xl" />
					<div class="text-weight-bold">{{ navigation.label }}</div>
				</q-card-section>
			</q-card>
		</div>
	</q-drawer>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		navigations: [
			{
				label: 'Clients',
				icon: 'o_groups',
				path: '/clients',
			},
			{
				label: 'Contracts',
				icon: 'o_description',
				path: '/contracts',
			},
			{
				label: 'Invoices',
				icon: 'o_receipt',
				path: '/invoices',
			},
		],
	}),
	computed: {
		isShow() {
			return this.show;
		},
	},
};
</script>

<style></style>
