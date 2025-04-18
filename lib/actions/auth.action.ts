'use server';
import { auth as serverAuth, firestore, auth } from '@/firebase/server';
import action from '@/handler/action';
import { cookies } from 'next/headers';
import {
	DeleteAccountSchema,
	GetUserSchema,
	SignInSchema,
	SignUpSchema,
	UpdateProfileSchema,
} from '../../validations/validations';
import handleError from '@/handler/error';
import { NotFoundError } from '../http-errors';
import { FirebaseError } from 'firebase/app';
import { error } from 'console';
import {
	AuthCredentials,
	GetUserParams,
	Account,
	DeleteAccountParams,
	UpdateAccountParams,
} from '@/types/action';
import { revalidatePath } from 'next/cache';
import ROUTES from '@/constants/routes';

export const removeToken = async () => {
	const cookiesStore = await cookies();
	cookiesStore.delete('firebaseAuthToken');
	cookiesStore.delete('firebaseAuthRefreshToken');
};

export const setToken = async ({
	//Set token and refreshToken to cookie
	token,
	refreshToken,
}: {
	token: string;
	refreshToken: string;
}) => {
	try {
		const verifiedToken = await serverAuth.verifyIdToken(token); // ตรวจสอบ Token ที่ส่งมาแล้วแปลงข้อมูลเป็น JWT
		if (!verifiedToken) {
			return;
		}

		const userRecord = await serverAuth.getUser(verifiedToken.uid); // รับการบันทึกผู้ใช้จาก Token ที่ยืนยันแล้ว
		if (
			process.env.ADMIN_EMAIL === userRecord.email &&
			!userRecord.customClaims?.admin
		) {
			serverAuth.setCustomUserClaims(verifiedToken.uid, {
				admin: true,
			});
		} // เช็คUser ปัจจุบันว่าเป็น Admin หรือไม่และเช็คว่าได้ทำการกำหนดสิทธิ์ Admin ไว้หรือยังบน Firebase

		const cookieStore = await cookies(); // สร้าง cookeieStore เพื่อเก็บ Token และ RefreshToken (Next.js 15 cookeies Return ออกมาเป็น Promise ต้องใช้ Await)
		cookieStore.set('firebaseAuthToken', token, {
			httpOnly: true, // เฉพาะให้ JavaScript ที่ทำงานในฝั่งเซิร์ฟเวอร์เท่านั้นที่สามารถเข้าถึงได้
			secure: process.env.NODE_ENV === 'production', // ใช้เฉพาะในโหมด production เท่านั้น
		});
		cookieStore.set('firebaseAuthRefreshToken', refreshToken, {
			httpOnly: true, // เฉพาะให้ JavaScript ที่ทำงานในฝั่งเซิร์ฟเวอร์เท่านั้นที่สามารถเข้าถึงได้
			secure: process.env.NODE_ENV === 'production', // ใช้เฉพาะในโหมด production เท่านั้น
		});
	} catch (error) {
		console.error(error);
	}
};

export const createAccount = async (userData: {
	uid: string;
	displayName: string | null;
	email: string | null;
	providerType: string;
	photoURL: string | undefined;
	createdAt: string | undefined;
}): Promise<ActionResponse> => {
	try {
		const { uid, displayName, email, providerType, photoURL, createdAt } =
			userData;

		if (!uid || !email) {
			throw new Error('ข้อมูลผู้ใช้ไม่ครบถ้วน');
		}

		const userDoc = await firestore.collection('users').doc(uid).get();

		if (!userDoc.exists) {
			// สร้างเฉพาะเมื่อยังไม่มีข้อมูลผู้ใช้
			await firestore
				.collection('users')
				.doc(uid)
				.set({
					uid,
					username: displayName,
					email,
					createdAt,
					updatedAt: createdAt,
					providerType,
					photoURL: photoURL ?? '',
				});
		}
		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};

export const signUpWithCredentials = async (
	params: AuthCredentials
): Promise<ActionResponse> => {
	const validationResult = await action({ params, schema: SignUpSchema });

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { username, email, password, confirmPassword } =
		validationResult.params!;

	try {
		try {
			const existingUser = await serverAuth.getUserByEmail(email);
			if (existingUser) {
				return {
					success: false,
					error: { message: 'This email has been already used!' },
				};
			}
		} catch (error) {
			// ถ้าเป็น error auth/user-not-found ถือว่าปกติ สามารถลงทะเบียนได้
			if (error instanceof FirebaseError) {
				if (error.code !== 'auth/user-not-found') {
					throw error; // ถ้าเป็น error อื่น ให้โยนต่อไป
				}
			}

			// ไม่พบผู้ใช้ = ดี เพราะเรากำลังสร้างผู้ใช้ใหม่
		}

		// 2. ตรวจสอบ username ที่ซ้ำกันอย่างถูกต้อง
		const usernameQuery = await firestore
			.collection('users')
			.where('username', '==', username)
			.limit(1)
			.get();

		if (!usernameQuery.empty) {
			return {
				success: false,
				error: { message: 'This username has been already used!' },
			};
		}

		const userCredential = await serverAuth.createUser({
			displayName: username,
			email,
			password,
		});

		// 4. เก็บข้อมูลใน Firestore โดยใช้ UID จาก auth เป็น document ID

		const userRecord = await serverAuth.getUser(userCredential.uid);

		if (userRecord) {
			const { uid, email, displayName, photoURL, providerData } = userRecord;
			const createdAt = userRecord.metadata.creationTime;
			const providerType = providerData[0]?.providerId;
			await createAccount({
				uid,
				email: email ?? null,
				displayName: displayName ?? null,
				providerType,
				photoURL,
				createdAt,
			});
		}

		// await createAccount(userRecord as unknown as User);

		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};

export const validateSignInWithCredentials = async (
	params: Pick<AuthCredentials, 'email' | 'password'>
): Promise<ActionResponse> => {
	const validationResult = await action({ params, schema: SignInSchema });

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { email, password } = validationResult.params!;

	try {
		try {
			const existingUser = await serverAuth.getUserByEmail(email);
			if (!existingUser) {
				throw new NotFoundError('User');
			}
		} catch (error) {
			// ถ้าเป็น error auth/user-not-found ถือว่าปกติ สามารถลงทะเบียนได้
			if (error instanceof FirebaseError) {
				if (error.code !== 'auth/user-not-found') {
					throw error; // ถ้าเป็น error อื่น ให้โยนต่อไป
				}
			}
		}

		const userSnapshot = await firestore
			.collection('users')
			.where('email', '==', email)
			.get();

		if (userSnapshot.empty) {
			throw new NotFoundError('Account');
		}

		return {
			success: true,
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};

export const getUserById = async (
	params: GetUserParams
): Promise<
	ActionResponse<{
		user: Account;
	}>
> => {
	const validationResult = await action({ params, schema: GetUserSchema });

	if (validationResult instanceof error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { id } = params;

	try {
		const userDoc = await firestore.collection('users').doc(id).get();

		// ตรวจสอบว่าเอกสารมีอยู่จริง
		if (!userDoc.exists) throw new Error('User not found');

		// ใช้ .data() เพื่อดึงข้อมูลจาก DocumentSnapshot
		const userData = userDoc.data();

		return {
			success: true,
			data: {
				user: JSON.parse(JSON.stringify(userData)),
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};

export const updateUser = async (
	params: UpdateAccountParams
): Promise<ActionResponse> => {
	const validationResult = await action({
		params,
		schema: UpdateProfileSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { id, username } = validationResult.params!;

	try {
		const userDoc = await firestore.collection('users').doc(id).get();

		if (!userDoc.exists) {
			throw new Error('User not found');
		}

		const userData = userDoc.data();
		if (userData?.providerType === 'google.com') {
			if (userData?.username !== username) {
				await firestore.collection('users').doc(id).update({
					username,
				});
			}
		} else {
			if (userData?.username !== username) {
				const usernameQuery = await firestore
					.collection('users')
					.where('username', '==', username)
					.limit(1)
					.get();

				if (!usernameQuery.empty) {
					return {
						success: false,
						error: { message: 'This username has been already used!' },
					};
				}

				await firestore.collection('users').doc(id).update({
					username,
				});
			}
		}
		revalidatePath(`${ROUTES.PROFILE(id)}`);
		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};

export const deleteAccount = async (
	params: DeleteAccountParams
): Promise<ActionResponse> => {
	const validationResult = await action({
		params,
		schema: DeleteAccountSchema,
	});

	if (validationResult instanceof error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { id } = params;

	try {
		await firestore.collection('users').doc(id).delete();

		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};
