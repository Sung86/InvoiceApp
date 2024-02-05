<template>
	<q-layout view="lHh Lpr lFf" style="height: 100vh">
		<Header v-if="isSignIn" @toggleSideBar="isShowSideBar = !isShowSideBar" />
		<SideBarLeft v-if="isSignIn" :show="isShowSideBar" />
		<q-page-container style="min-height: inherit" class="bg-grey-2">
			<PopUpDialog />
			<q-page>
				<router-view />
			</q-page>
		</q-page-container>
	</q-layout>
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters } from 'vuex';
export default {
	components: {
		Header: defineAsyncComponent(() => import('@/components/Header')),
		SideBarLeft: defineAsyncComponent(() => import('@/components/SideBarLeft')),
		PopUpDialog: defineAsyncComponent(() => import('@/components/PopUpDialog')),
	},

	data: () => ({
		isShowSideBar: true,
	}),
	computed: {
		...mapGetters({
			isSignIn: 'user/getIsSignIn',
		}),
	},
};
</script>
