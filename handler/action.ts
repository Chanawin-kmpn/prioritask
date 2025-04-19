'use server';

import { UnauthorizedError, ValidationError } from '@/lib/http-errors';
import { ZodError, ZodSchema } from 'zod';
import { cookies } from 'next/headers';
import { auth } from '@/firebase/server';

// นิยามประเภทข้อมูลผู้ใช้ที่จะส่งคืน
type FirebaseUser = {
	uid: string;
	email: string | undefined;
	displayName: string | undefined;
	emailVerified: boolean;
	// เพิ่มฟิลด์อื่นๆ ตามที่ต้องการ
};

type ActionOptions<T> = {
	params?: T;
	schema?: ZodSchema<T>;
	authorize?: boolean;
};

async function action<T>({
	params,
	schema,
	authorize = false,
}: ActionOptions<T>) {
	if (schema && params) {
		try {
			schema.parse(params);
		} catch (error) {
			if (error instanceof ZodError) {
				return new ValidationError(
					error.flatten().fieldErrors as Record<string, string[]>
				);
			} else {
				return new Error('Schema validation failed');
			}
		}
	}

	let user: FirebaseUser | null = null;

	if (authorize) {
		try {
			// รับ session cookie จาก cookies
			const cookieStore = await cookies();
			const sessionCookie = cookieStore.get('firebaseAuthToken')?.value;

			if (!sessionCookie) {
				return new UnauthorizedError();
			}

			// ตรวจสอบความถูกต้องของ token
			const decodedToken = await auth.verifyIdToken(sessionCookie, true);

			// รับข้อมูลผู้ใช้
			const firebaseUser = await auth.getUser(decodedToken.uid);

			user = {
				uid: firebaseUser.uid,
				email: firebaseUser.email,
				displayName: firebaseUser.displayName,
				emailVerified: firebaseUser.emailVerified,
			};
		} catch (error) {
			console.error('Firebase auth error:', error);
			return new UnauthorizedError('Authorize failed!');
		}
	}
	return { params, user };
}

export default action;
