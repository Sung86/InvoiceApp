import { firebase } from '@/plugins/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateData as updateDataFirestore } from '@/apis/firestore';

const storage = getStorage(firebase);

const uploadFile = async (file, filePath) => {
	const fileRef = ref(storage, filePath);
	const uploadTask = await uploadBytes(fileRef, file);
	const downloadURL = await getDownloadURL(uploadTask.ref).then(downloadURL);
	return downloadURL;
};
export const uploadInvoicePdf = async (docId, file, filePath) => {
	const downloadURL = await uploadFile(file, filePath);
	const data = { pdfLink: downloadURL };
	return await updateDataFirestore('invoices', docId, data);
};
