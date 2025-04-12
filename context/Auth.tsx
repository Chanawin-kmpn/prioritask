'use client';
import { auth } from '@/firebase/client';
import handleError from '@/handler/error';
import {
	setToken,
	removeToken,
	createAccount,
} from '@/lib/actions/auth.action';
import {
	GoogleAuthProvider,
	ParsedToken,
	signInWithEmailAndPassword,
	signInWithPopup,
	User,
} from 'firebase/auth';
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
				const { uid, displayName, email, providerData } = result.user;
				const providerType = providerData[0]?.providerId;

				// เรียกใช้ Server Action
				await createAccount({
					uid,
					displayName,
					email,
					providerType,
				});
			}
		} catch (error) {
			console.error('เกิดข้อผิดพลาดตอนล็อกอิน:', error);
		}
	};

	const logout = async () => {
		await auth.signOut();
	};

	const loginWithCredential = async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
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
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
