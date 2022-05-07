import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from './user';
import popUpDialog from './popUpDialog';
import simpleTable from './simpleTable';

export default createStore({
	plugins: [
		createPersistedState({
			key: 'my-it-studio-invoice',
			paths: ['user'],
		}),
	],
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		user,
		popUpDialog,
		simpleTable,
	},
});
