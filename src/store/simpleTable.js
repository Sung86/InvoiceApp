import { getClients, getContracts, getInvoices } from '@/apis/firestore';
import { formatDate } from '@/helpers/time';
const initialState = () => ({
	clients: [],
	contracts: [],
	invoices: [],
});

const state = () => initialState();

const getters = {
	getClients: (state) => state.clients,
	getContracts: (state) => state.contracts,
	getInvoices: (state) => state.invoices,
};

const mutations = {
	SET_CLIENTS: (state, val) => (state.clients = val),
	SET_CONTRACTS: (state, val) => (state.contracts = val),
	SET_INVOICES: (state, val) => (state.invoices = val),
	RESET_STATE: (state) => {
		const newState = initialState();
		Object.keys(newState).forEach((key) => {
			state[key] = newState[key];
		});
	},
};

const actions = {
	async loadClients({ commit }) {
		const clients = await getClients().then((res) =>
			res.map(({ email, abn, name, _id }) => ({
				_id,
				clientId: _id,
				name,
				email,
				abn,
			}))
		);
		commit('SET_CLIENTS', clients);
	},
	async loadContracts({ commit }) {
		const contracts = await getContracts().then((res) =>
			res.map(({ _id, amount, contractNumber, projectName, client }) => ({
				_id,
				contractNumber,
				projectName,
				clientName: client.name,
				amount,
			}))
		);
		commit('SET_CONTRACTS', contracts);
	},
	async loadInvoices({ commit }) {
		const invoices = await getInvoices().then((res) =>
			res.map(
				({
					invoiceNumber,
					client,
					invoiceDate,
					invoiceAmount,
					_id,
					amountPaid,
					pdfLink,
				}) => ({
					_id,
					invoiceNumber,
					clientName: client.name,
					invoiceAmount,
					amountPaid,
					pdfLink,
					invoiceDate: formatDate(invoiceDate.toDate()),
				})
			)
		);
		commit('SET_INVOICES', invoices);
	},
	async updateData({ state, commit }, { tableName, data }) {
		const tableData = [...state[tableName]];
		const newTableData = tableData.map((d) => {
			if (d._id === data._id) {
				return {
					...d,
					...data,
				};
			}
			return d;
		});
		commit(`SET_${tableName.toUpperCase()}`, newTableData);
	},
	async addData({ state, commit }, { tableName, data }) {
		const newTableData = [...state[tableName], data];
		commit(`SET_${tableName.toUpperCase()}`, newTableData);
	},
};

export default { namespaced: true, state, getters, mutations, actions };
