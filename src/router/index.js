import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
const routes = [
	{
		path: '/',
		redirect: '/clients',
	},
	{
		path: '/login',
		name: 'Login',
		meta: {
			requiredAuth: false,
		},
		component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
	},
	{
		path: '/clients',
		name: 'Clients',
		meta: {
			requiredAuth: true,
		},
		component: () =>
			import(/* webpackChunkName: "clients" */ '@/views/Clients'),
	},
	{
		path: '/contracts',
		name: 'Contracts',
		meta: {
			requiredAuth: true,
		},
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/Contracts'),
	},
	{
		path: '/invoices',
		name: 'Invoices',
		meta: {
			requiredAuth: true,
		},
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/Invoices'),
	},
	{
		path: '/billTo/:contractId',
		name: 'BillTo',
		meta: {
			requiredAuth: true,
		},
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/BillTo'),
		props: true,
	},
	{
		path: '/invoiceDetail/:invoiceId',
		name: 'InvoiceDetail',
		meta: {
			requiredAuth: true,
		},
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/InvoiceDetail'),
		props: true,
	},
	{
		path: '/error404',
		name: 'Error404',
		meta: {
			requiredAuth: false,
		},
		component: () =>
			import(/* webpackChunkName: "error404" */ '@/views/Error404'),
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/error404',
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	const isSignIn = await store.getters['user/getIsSignIn'];
	console.log(isSignIn);
	if (to.meta.requiredAuth && !isSignIn) {
		next({ path: '/login' });
	}

	if (to.path === '/login' && isSignIn) {
		next({ path: '/' });
	}

	next();
});
export default router;
