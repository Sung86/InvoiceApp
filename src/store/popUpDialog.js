const initialState = () => ({
	docId: '',
	name: '',
	title: '',
	show: false,
	fields: [],
	actions: [],
});

const state = () => initialState();

const getters = {
	getDocId: (state) => state.docId,
	getName: (state) => state.name,
	getTitle: (state) => state.title,
	getShow: (state) => state.show,
	getFields: (state) => state.fields,
	getActions: (state) => state.actions,
};

const mutations = {
	SET_DOC_ID: (state, val) => (state.docId = val),
	SET_NAME: (state, val) => (state.name = val),
	SET_TITLE: (state, val) => (state.title = val),
	SET_SHOW: (state, val) => (state.show = val),
	SET_FIELDS: (state, val) => (state.fields = val),
	SET_ACTIONS: (state, val) => (state.actions = val),
	RESET_STATE: (state) => {
		const newState = initialState();
		Object.keys(newState).forEach((key) => {
			state[key] = newState[key];
		});
	},
};

const actions = {};

export default { namespaced: true, state, getters, mutations, actions };
