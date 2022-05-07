import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		redirect: '/login',
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
	},
	{
		path: '/clients',
		name: 'Clients',
		component: () =>
			import(/* webpackChunkName: "clients" */ '@/views/Clients'),
	},
	{
		path: '/contracts',
		name: 'Contracts',
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/Contracts'),
	},
	{
		path: '/invoices',
		name: 'Invoices',
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/Invoices'),
	},
	{
		path: '/billTo',
		name: 'BillTo',
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/BillTo'),
	},
	{
		path: '/invoiceDetail',
		name: 'InvoiceDetail',
		component: () =>
			import(/* webpackChunkName: "contracts" */ '@/views/InvoiceDetail'),
	},
	{
		path: '/error404',
		name: 'Error404',
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

export default router;
