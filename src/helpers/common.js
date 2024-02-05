import store from '@/store';
export const useDialog = (columns, rows, rowIndex, forAction = 'update') => {
	const fields = [];
	if (forAction == 'create' || rows[rowIndex]) {
		columns.forEach((col) => {
			if (col.name !== 'actions') {
				let value = '';
				let editable = true;
				if (forAction === 'update') {
					value = rows[rowIndex][col.name];
					editable = col.editable;
				}

				fields.push({
					label: col.label,
					value,
					editable,
					key: col.name,
				});
			}
		});
	}
	return { fields };
};

export const useTableHeaders = (headers) => {
	const columns = [...headers, { name: 'actions', label: 'Actions' }];
	const tableHeaders = columns.map((header) => ({
		name: header.name,
		label: header.label,
		field: header.name,
		align: 'center',
		sortable: header.name === 'actions' ? false : true,
		editable: header.editable,
		style: {
			width: header.name === 'actions' ? '140px' : 'auto',
		},
	}));

	return tableHeaders;
};

const generateDocumentNumber = async (documents, field) => {
	const time = new Date();
	const tokenised = time.toISOString().slice(0, 10).split('-');
	const year = tokenised[0];
	const month = tokenised[1];
	const day = Number(tokenised[2]) + 1;

	const todayContracts = documents.filter(
		(doc) => doc[field].toString().substring(0, 8) === `${year}${month}${day}`
	);

	const newQuantity = todayContracts.length + 1;
	const documentId = (100 + newQuantity).toString().substring(1);
	const documentNumber = `${year}${month}${day}${documentId}`;
	return documentNumber;
};

export const generateContractNumber = async () => {
	await store.dispatch('simpleTable/loadContracts');
	const contracts = await store.getters['simpleTable/getContracts'];
	return await generateDocumentNumber(contracts, 'contractNumber');
};

export const generateInvoiceNumber = async () => {
	await store.dispatch('simpleTable/loadInvoices');
	const invoices = await store.getters['simpleTable/getInvoices'];
	return await generateDocumentNumber(invoices, 'invoiceNumber');
};

export const priceFormatter = (price) => {
	const result = new Intl.NumberFormat('en-AU', {
		style: 'currency',
		currency: 'AUD',
		maximumFractionDigits: 2,
		minimumFractionDigits: 1,
	}).format(price);

	const tokenized = result.split('.');
	if (tokenized.length === 2) {
		const decimals = tokenized[1];
		if (decimals == 0) return tokenized[0];
	}
	return result;
};

export const validateDate = (date) => {
	return /^\d\d\/\d\d\/\d\d\d\d$/.test(date);
};
