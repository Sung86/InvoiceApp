import { logInWithEmailAndPassword } from '@/apis/authentication';

const initialState = () => {
	return {
		user: {},
		isSignIn: false,
	};
};

const state = () => initialState();

const getters = {
	getUser: (state) => state.user,
	getIsSignIn: (state) => state.isLogin,
};

const mutations = {
	SET_USER: (state, val) => (state.user = val),
	SET_IS_SIGN_IN: (state, val) => (state.isLogin = val),
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
	signOut({ commit }) {
		commit('RESET_USER_STATE');
	},
};

export default { namespaced: true, state, getters, mutations, actions };
