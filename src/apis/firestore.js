import { firebase } from '@/plugins/firebase';
import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	addDoc,
	doc,
	updateDoc,
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

export const updateData = async (collection, docId, data) => {
	const ref = doc(db, collection, docId);
	try {
		await updateDoc(ref, data);
		return { state: true };
	} catch (error) {
		return {
			state: false,
			error,
		};
	}
};

export const addData = async (collectionName, data) => {
	const ref = collection(db, collectionName);
	try {
		const res = await addDoc(ref, data);
		const docId = res.id;
		return { state: true, docId };
	} catch (error) {
		return { state: false, error };
	}
};

export const createDocReference = (referencePath) => doc(db, referencePath);
