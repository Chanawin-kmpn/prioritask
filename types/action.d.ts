import { User } from 'firebase/auth';

interface AuthCredentials {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface Account {
	uid: string;
	username: string;
	email: string;
	photoURL: string;
	providerType: string;
	createdAt: Date;
	updatedAt: Date;
}

interface GetUserParams {
	id: string;
}

interface DeleteAccountParams {
	id: string;
}
