import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
	const path = request.nextUrl.searchParams.get('redirect');

	if (!path) {
		return NextResponse.redirect(new URL('/', request.url)); // ถ้าไม่มี path ที่เข้าล่าสุดก็ส่ง user ไปหน้า home
	}

	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('firebaseAuthRefreshToken')?.value;

	if (!refreshToken) {
		return NextResponse.redirect(new URL('/', request.url)); // ถ้าไม่มี path ที่เข้าล่าสุดก็ส่ง user ไปหน้า home
	}

	try {
		const response = await fetch(
			`https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
				}),
			}
		);

		const json = await response.json();
		const newToken = json.id_token;

		cookieStore.set('firebaseAuthToken', newToken, {
			httpOnly: true, // เฉพาะให้ JavaScript ที่ทำงานในฝั่งเซิร์ฟเวอร์เท่านั้นที่สามารถเข้าถึงได้
			secure: process.env.NODE_ENV === 'production', // ใช้เฉพาะในโหมด production เท่านั้น
		});

		return NextResponse.redirect(new URL(path, request.url));
	} catch (error) {
		console.log('Failed to refresh token: ', error);
		return NextResponse.redirect(new URL('/', request.url));
	}
};
