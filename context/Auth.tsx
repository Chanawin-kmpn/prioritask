'use client';
import { auth } from '@/firebase/client';
import handleError from '@/handler/error';
import {
	setToken,
	removeToken,
	createAccount,
} from '@/lib/actions/auth.action';
import {
	EmailAuthProvider,
	GoogleAuthProvider,
	ParsedToken,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signInWithPopup,
	updateEmail,
	updatePassword,
	updateProfile,
	User,
} from 'firebase/auth';
import { redirect } from 'next/navigation';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

type AuthContext = {
	currentUser: User | null;
	loginWithGoogle: () => Promise<void>;
	customCliams: ParsedToken | null;
	logout: () => Promise<void>;
	loginWithCredential: (
		email: string,
		password: string
	) => Promise<ActionResponse>;
	updateUserProfile: (username: string) => Promise<ActionResponse>;
	updateUserPassword: (
		currentPassword: string,
		newPassword: string
	) => Promise<ActionResponse>;
};

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [customCliams, setCustomClaims] = useState<ParsedToken | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setCurrentUser(user ?? null);
			if (user) {
				const tokenResult = await user.getIdTokenResult();
				const token = tokenResult.token;
				const refreshToken = user.refreshToken;
				const claims = tokenResult.claims;
				setCustomClaims(claims ?? null);
				if (token && refreshToken) {
					await setToken({
						token,
						refreshToken,
					});
				}
			} else {
				await removeToken();
			}
		});

		return () => unsubscribe();
	}, []);

	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			if (result.user) {
				const { uid, displayName, email, providerData, photoURL } = result.user;
				const providerType = providerData[0]?.providerId;
				const createdAt = result.user.metadata.creationTime;
				// เรียกใช้ Server Action
				await createAccount({
					uid,
					displayName,
					email,
					providerType,
					photoURL: photoURL ?? '',
					createdAt,
				});
			}
		} catch (error) {
			console.error('เกิดข้อผิดพลาดตอนล็อกอิน:', error);
		}
	};

	const logout = async () => {
		await auth.signOut();
		redirect('/');
	};

	const loginWithCredential = async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			return { success: true };
		} catch (error) {
			return handleError(error) as ErrorResponse;
		}
	};

	const updateUserProfile = async (username: string) => {
		try {
			await updateProfile(currentUser!, { displayName: username });
			return { success: true };
		} catch (error) {
			return handleError(error) as ErrorResponse;
		}
	};

	const updateUserPassword = async (
		currentPassword: string,
		newPassword: string
	) => {
		try {
			const credential = EmailAuthProvider.credential(
				currentUser?.email!,
				currentPassword
			);
			try {
				await reauthenticateWithCredential(currentUser!, credential);
			} catch (error) {
				return {
					success: false,
					error: { message: 'Current password invalid' },
				};
			}
			await updatePassword(currentUser!, newPassword);
			return { success: true };
		} catch (error) {
			return handleError(error) as ErrorResponse;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				loginWithGoogle,
				customCliams,
				logout,
				loginWithCredential,
				updateUserProfile,
				updateUserPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
