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
}

interface GetUserParams {
	id: string;
}

interface DeleteAccountParams {
	id: string;
}

interface UpdateAccountParams {
	id: string;
	username?: string;
}

interface ForgotPasswordParams {
	email: string;
}

interface CreateTaskParams {
	name: string;
	description?: string | null;
	dueDate: Date;
	dueTime?: string | null;
	priority: TaskPriority;
	status: TaskStatus;
	notify: boolean;
}
