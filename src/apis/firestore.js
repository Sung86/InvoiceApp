import { firebase } from '@/plugins/firebase';
import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	addDoc,
	doc,
	updateDoc,
	Timestamp,
} from 'firebase/firestore';

const db = getFirestore(firebase);

export const getClients = async () => {
	const querySnapshot = await getDocs(collection(db, 'clients'));
	return querySnapshot.docs.map((doc) => ({
		...doc.data(),
		_id: doc.id,
	}));
};

export const getContracts = async () => {
	const querySnapshot = await getDocs(collection(db, 'contracts'));
	return await Promise.all(
		querySnapshot.docs.map(async (doc) => {
			const clientDoc = await getDoc(doc.data().clientRef);
			return {
				_id: doc.id,
				...doc.data(),
				client: {
					...clientDoc.data(),
					_id: clientDoc.id,
				},
			};
		})
	);
};

export const getContract = async (docId) => {
	const docRef = doc(db, 'contracts', docId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const clientDoc = await getDoc(docSnap.data().clientRef);
		return {
			...docSnap.data(),
			_id: docSnap.id,
			client: { ...clientDoc.data(), _id: clientDoc.id },
		};
	}
};

export const getInvoices = async () => {
	const querySnapshot = await getDocs(collection(db, 'invoices'));
	return await Promise.all(
		querySnapshot.docs.map(async (doc) => {
			const contractDoc = await getDoc(doc.data().contractRef);
			const clientDoc = await getDoc(contractDoc.data().clientRef);
			return {
				_id: doc.id,
				...doc.data(),
				contract: {
					...contractDoc.data(),
					_id: contractDoc.id,
				},
				client: {
					...clientDoc.data(),
					_id: clientDoc.id,
				},
			};
		})
	);
};

export const getInvoice = async (docId) => {
	const docRef = doc(db, 'invoices', docId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const clientDoc = await getDoc(docSnap.data().clientRef);
		return {
			...docSnap.data(),
			_id: docSnap.id,
			client: { ...clientDoc.data(), _id: clientDoc.id },
		};
	}
};

export const updateData = async (collection, docId, data) => {
	const ref = doc(db, collection, docId);
	try {
		await updateDoc(ref, data);
		return { status: true };
	} catch (error) {
		return {
			status: false,
			error,
		};
	}
};

export const addData = async (collectionName, data) => {
	const ref = collection(db, collectionName);
	try {
		const res = await addDoc(ref, data);
		const docId = res.id;
		return { status: true, docId };
	} catch (error) {
		return { status: false, error };
	}
};

export const createDocReference = (referencePath) => doc(db, referencePath);
export const createTimestamp = (dateString = '') => {
	if (dateString !== '') {
		const splitted = dateString.split('/');
		const day = splitted[0];
		const month = splitted[1] - 1;
		const year = splitted[2];
		const date = new Date(year, month, day);
		return Timestamp.fromDate(date);
	}
	return Timestamp.now();
};
