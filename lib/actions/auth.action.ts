'use server';
import { auth, firestore } from '@/firebase/server';
import action from '@/handler/action';
import { cookies } from 'next/headers';
import { SignUpSchema } from '../validations';
import handleError from '@/handler/error';

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
		const verifiedToken = await auth.verifyIdToken(token); // ตรวจสอบ Token ที่ส่งมาแล้วแปลงข้อมูลเป็น JWT
		if (!verifiedToken) {
			return;
		}

		const userRecord = await auth.getUser(verifiedToken.uid); // รับการบันทึกผู้ใช้จาก Token ที่ยืนยันแล้ว
		if (
			process.env.ADMIN_EMAIL === userRecord.email &&
			!userRecord.customClaims?.admin
		) {
			auth.setCustomUserClaims(verifiedToken.uid, {
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

export const signUpWithCredentials = async (
	params: SignUpWithEmail
): Promise<ActionResponse> => {
	const validationResult = await action({ params, schema: SignUpSchema });

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { username, email, password, confirmPassword } =
		validationResult.params!;

	try {
		try {
			const existingUser = await auth.getUserByEmail(email);
			if (existingUser) {
				return {
					success: false,
					error: { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
				};
			}
		} catch (error: any) {
			// ถ้าเป็น error auth/user-not-found ถือว่าปกติ สามารถลงทะเบียนได้
			if (error.code !== 'auth/user-not-found') {
				throw error; // ถ้าเป็น error อื่น ให้โยนต่อไป
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
				error: { message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' },
			};
		}

		const userCredential = await auth.createUser({
			displayName: username,
			email,
			password,
		});

		// 4. เก็บข้อมูลใน Firestore โดยใช้ UID จาก auth เป็น document ID
		await firestore.collection('users').doc(userCredential.uid).set({
			username,
			email,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};
