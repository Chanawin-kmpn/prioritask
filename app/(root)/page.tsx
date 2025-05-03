import { auth } from '@/firebase/server';
import EisenhowerMatrix from '@/components/matrix/EisenhowerMatrix';
import GuestEisenhowerMatrix from '@/components/matrix/GuestEisenhowerMatrix';
import { cookies } from 'next/headers';
import { UnauthorizedError } from '@/lib/http-errors';

export default async function Home() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get('firebaseAuthToken')?.value;

	// ตรวจสอบว่ามี session cookie หรือไม่
	if (!sessionCookie) {
		// ถ้าไม่มี session cookie ให้ return GuestEisenhowerMatrix
		return (
			<div className="bg-light200_dark100 flex h-full justify-center py-32">
				<GuestEisenhowerMatrix />
			</div>
		);
	}

	//ตรวจสอบความถูกต้องของ token
	let decodedToken;
	let userId;
	try {
		decodedToken = await auth.verifyIdToken(sessionCookie, true);
		const user = await auth.getUser(decodedToken.uid);
		userId = user.uid;
	} catch (error: any) {
		if (error.code === 'auth/id-token-expired') {
			// ดึง refresh token จากคุกกี้
			const refreshToken = cookieStore.get('firebaseAuthRefreshToken')?.value;

			// รีเฟรช token ที่นี่
			if (refreshToken) {
				// สามารถใช้ API ที่คุณสร้างขึ้นมาเพื่อรีเฟรช ID token
				const response = await fetch(
					`https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ refreshToken }),
					}
				);

				const json = await response.json();
				if (json.id_token) {
					cookieStore.set('firebaseAuthToken', json.id_token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
					});
					// สามารถทำการตรวจสอบ token ใหม่หลังจากนี้ได้
					decodedToken = await auth.verifyIdToken(json.id_token, true);
					const user = await auth.getUser(decodedToken.uid);
					userId = user.uid;
				}
			}
		} else {
			throw new UnauthorizedError(
				error instanceof Error ? error.message : String(error)
			);
		}
	}

	//รับข้อมูลผู้ใช้

	return (
		<div className="bg-light200_dark100 flex h-full justify-center py-32">
			<EisenhowerMatrix userId={userId!} />
		</div>
	);
}
