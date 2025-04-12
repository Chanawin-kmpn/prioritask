import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

export async function middleware(request: NextRequest) {
	if (request.method === 'POST') {
		return NextResponse.next();
	}

	const cookieStore = await cookies();
	const tokenValue = cookieStore.get('firebaseAuthToken')?.value;

	const { pathname } = request.nextUrl;

	if (
		!tokenValue &&
		(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))
	) {
		return NextResponse.next();
	}

	if (
		tokenValue &&
		(pathname.startsWith('/sign-in') ||
			pathname.startsWith('/sign-up') ||
			pathname.startsWith('/dashboard'))
	) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (!tokenValue && pathname.startsWith('/dashboard')) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (!tokenValue) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	const decodedToken = decodeJwt(tokenValue);

	if (decodedToken.exp && (decodedToken.exp - 300) * 1000 < Date.now()) {
		return NextResponse.redirect(
			new URL(
				`/api/refresh-token?redirect=${encodeURIComponent(pathname)}`,
				request.url // ทำการเก็บ url ล่าสุดที่ผู้ใช้กำลังเข้า
			)
		);
	} //เผื่อเวลาไว้ 5 นาที

	if (!decodedToken.admin && pathname.startsWith('/admin-dashboard')) {
		return NextResponse.redirect(new URL('/', request.url));
	} // เช็คว่าเป็น Admin หรือไม่

	if (decodedToken.admin && pathname.startsWith('/account/my-favourites')) {
		return NextResponse.redirect(new URL('/', request.url));
	}
	return NextResponse.next();
}
export const config = {
	matcher: ['/sign-in', '/sign-up', '/dashboard'],
};
