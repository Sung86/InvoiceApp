import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyApu9xEJQVHeZKMU57wrxuWXoqYUY6I3Wo',
	authDomain: 'fir-invoice-80985.firebaseapp.com',
	projectId: 'fir-invoice-80985',
	storageBucket: 'fir-invoice-80985.appspot.com',
	messagingSenderId: '497100031083',
	appId: '1:497100031083:web:b00f71cfc22efd8b2f1d2e',
};

const firebase = initializeApp(firebaseConfig);
export default firebase;
