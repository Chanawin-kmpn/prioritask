import EisenhowerMatrix from '@/components/matrix/EisenhowerMatrix';
import { Suspense } from 'react';
import Loading from './loading';
import GuestEisenhowerMatrix from '@/components/matrix/GuestEisenhowerMatrix';
import { auth } from '@/firebase/server';
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

	// ตรวจสอบความถูกต้องของ token
	let decodedToken;
	let userId;
	try {
		decodedToken = await auth.verifyIdToken(sessionCookie, true);
		const user = await auth.getUser(decodedToken.uid);
		userId = user.uid;
	} catch (error) {
		// หากตรวจสอบไม่สำเร็จ ให้จัดการข้อผิดพลาด เช่น redirect หรือแสดงข้อความ
		throw new UnauthorizedError('Token verification failed');
	}

	// รับข้อมูลผู้ใช้

	return (
		<div className="bg-light200_dark100 flex h-full justify-center py-32">
			<EisenhowerMatrix userId={userId} />
		</div>
	);
}
