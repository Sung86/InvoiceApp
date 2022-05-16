import '@/plugins/firebase';
import {
	getAuth,
	setPersistence,
	signInWithEmailAndPassword,
	browserLocalPersistence,
	signOut,
} from 'firebase/auth';

const auth = getAuth();

export const logInWithEmailAndPassword = async (email, password) => {
	return await setPersistence(auth, browserLocalPersistence)
		.then(() => {
			return signInWithEmailAndPassword(auth, email, password).then(
				(userCredential) => {
					const user = userCredential.user;
					return {
						data: user,
						status: true,
					};
				}
			);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			return {
				data: { errorCode, errorMessage },
				status: false,
			};
		});
};

export const logout = async () => {
	return await signOut(auth);
};
