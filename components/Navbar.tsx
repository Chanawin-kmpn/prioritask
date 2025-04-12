import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import { cookies } from 'next/headers';
import { auth } from '@/firebase/server';
import { getUserById } from '@/lib/actions/auth.action';

const Navbar = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get('firebaseAuthToken')?.value;

	// ถ้าไม่มี sessionCookie แสดง NavbarUnauthenticated ไปเลย
	if (!sessionCookie) {
		return <NavbarUnauthenticated />;
	}

	try {
		const decodedToken = await auth.verifyIdToken(sessionCookie, true);
		const { data } = await getUserById({ id: decodedToken.uid });
		const { uid, username, photoURL } = data?.user || {};

		return (
			<nav className="bg-light200_dark100 z-50 flex w-full">
				<div className="flex-1 border-b py-4 pl-16">
					<Link href="/" className="flex w-fit items-center">
						<Image
							src="/images/prioritask-logo.png"
							width={250}
							height={100}
							alt="Prioritask Logo"
							priority
						/>
					</Link>
				</div>
				<div className="border-dark-100 dark:border-light-200 bg-light200_dark100 relative flex min-w-[300px] items-center justify-center border-b border-l">
					<UserAvatar
						uid={uid ?? ''}
						username={username ?? ''}
						photoURL={photoURL ?? ''}
					/>
				</div>
			</nav>
		);
	} catch (error) {
		// ถ้าโทเคนหมดอายุหรือยืนยันล้มเหลว
		console.error('Token validation error:', error);
		return <NavbarUnauthenticated />;
	}
};

// NavbarUnauthenticated: สำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน
const NavbarUnauthenticated = () => (
	<nav className="bg-light200_dark100 z-50 flex w-full">
		<div className="flex-1 border-b py-4 pl-16">
			<Link href="/" className="flex w-fit items-center">
				<Image
					src="/images/prioritask-logo.png"
					width={250}
					height={100}
					alt="Prioritask Logo"
					priority
				/>
			</Link>
		</div>
		<div className="border-dark-100 dark:border-light-200 bg-light200_dark100 relative flex min-w-[300px] items-center justify-center border-b border-l">
			<Link href="/sign-in" className="font-bold tracking-[8px] uppercase">
				Sign In
			</Link>
		</div>
	</nav>
);

export default Navbar;
