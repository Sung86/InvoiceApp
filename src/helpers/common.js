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
	const columns = [...headers, { name: 'actions', label: '' }];
	const tableHeaders = columns.map((header) => ({
		name: header.name,
		label: header.label,
		field: header.name,
		align: 'center',
		sortable: header.name === 'actions' ? true : false,
		editable: header.editable,
	}));

	return tableHeaders;
};

export const generateContractNumber = async () => {
	const time = new Date();
	const tokenised = time.toISOString().slice(0, 10).split('-');
	const year = tokenised[0];
	const month = tokenised[1];
	const day = tokenised[2];

	const contracts = await store.getters['simpleTable/getContracts'];
	const todayContracts = contracts.filter(
		(contract) =>
			contract.contractNumber.toString().substring(0, 8) ===
			`${year}${month}${day}`
	);

	const newQuantity = todayContracts.length + 1;
	const contractId = (100 + newQuantity).toString().substring(1);
	const contractNumber = `${year}${month}${day}${contractId}`;
	return contractNumber;
};
