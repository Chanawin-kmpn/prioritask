'use client';
import { auth } from '@/firebase/client';
import handleError from '@/handler/error';
import {
	setToken,
	removeToken,
	createAccount,
} from '@/lib/actions/auth.action';
import { rateLimitCheck } from '@/lib/utils';
import {
	EmailAuthProvider,
	GoogleAuthProvider,
	ParsedToken,
	reauthenticateWithCredential,
	sendPasswordResetEmail,
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
	resetUserPassword: (email: string) => Promise<ActionResponse>;
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
	}, [currentUser]);

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
			// Check rate limit
			const limitResult = rateLimitCheck('PROFILE_UPDATE', currentUser?.uid!);

			if (limitResult.limited) {
				return {
					success: false,
					error: {
						message: `You are updating your profile too frequently. Please wait another ${limitResult.remainingMinutes} minutes.`,
					},
				};
			}

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
			// Check rate limit
			const limitResult = rateLimitCheck('PASSWORD_CHANGE', currentUser?.uid!);

			if (limitResult.limited) {
				return {
					success: false,
					error: {
						message: `You are changing your password too frequently. Please wait another ${limitResult.remainingMinutes} minutes.`,
					},
				};
			}
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

	const resetUserPassword = async (email: string) => {
		try {
			// Check rate limit for password reset
			const limitResult = rateLimitCheck('PASSWORD_RESET', email);

			if (limitResult.limited) {
				return {
					success: false,
					error: {
						message: `You are requesting password resets too frequently. Please wait another ${limitResult.remainingMinutes} minutes.`,
					},
				};
			}

			await sendPasswordResetEmail(auth, email);

			return { success: true };

			// If passed the rate limit, send password reset email
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
				resetUserPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
