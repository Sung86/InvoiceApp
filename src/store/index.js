import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from './user';
export default createStore({
	plugins: [
		createPersistedState({
			key: 'user',
			paths: ['user'],
		}),
	],
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		user,
	},
});
