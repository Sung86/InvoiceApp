import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyDLyccuKwvwsiyUf17JvdBNOgDLeSqHoPc',
	authDomain: 'invoiceapp-fb42f.firebaseapp.com',
	projectId: 'invoiceapp-fb42f',
	storageBucket: 'invoiceapp-fb42f.appspot.com',
	messagingSenderId: '305154912238',
	appId: '1:305154912238:web:4abdbbf93550c0fd3d68ff',
};

export const firebase = initializeApp(firebaseConfig);
