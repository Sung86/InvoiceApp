<template>
	<q-layout view="lHh Lpr lFf">
		<Header v-if="isSignIn" @toggleSideBar="isShowSideBar = !isShowSideBar" />
		<SideBarLeft v-if="isSignIn" :show="isShowSideBar" />
		<q-page-container style="height: 100vh" class="bg-grey-2">
			<PopUpDialog v-if="show" />
			<router-view />
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
			show: 'popUpDialog/getShow',
			isSignIn: 'user/getIsSignIn',
		}),
	},
};
</script>
