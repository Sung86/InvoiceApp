import { logInWithEmailAndPassword, logout } from '@/apis/authentication';

const initialState = () => ({
	user: {},
	isSignIn: false,
});

const state = () => initialState();

const getters = {
	getUser: (state) => state.user,
	getIsSignIn: (state) => state.isSignIn,
};

const mutations = {
	SET_USER: (state, val) => (state.user = val),
	SET_IS_SIGN_IN: (state, val) => (state.isSignIn = val),
	RESET_USER_STATE: (state) => {
		const newState = initialState();
		Object.keys(newState).forEach((key) => {
			state[key] = newState[key];
		});
	},
};

const actions = {
	async signIn({ commit }, payload) {
		const email = payload.email;
		const password = payload.password;

		const res = await logInWithEmailAndPassword(email, password);
		if (res.status) {
			const user = res.data;
			commit('SET_USER', user);
			commit('SET_IS_SIGN_IN', true);
			return true;
		}
		return false;
	},
	async signOut({ commit }) {
		await logout();
		commit('RESET_USER_STATE');
	},
};

export default { namespaced: true, state, getters, mutations, actions };
