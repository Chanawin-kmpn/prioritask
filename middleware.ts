import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
}
export const config = {
	matcher: ['/sign-in', '/sign-up', '/dashboard'],
};
