'use client';
import { auth } from '@/firebase/client';
import { setToken, removeToken } from '@/lib/actions/auth.action';
import {
	GoogleAuthProvider,
	ParsedToken,
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
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	};

	const logout = async () => {
		await auth.signOut();
	};

	return (
		<AuthContext.Provider
			value={{ currentUser, loginWithGoogle, customCliams, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
