'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/Auth';
import ROUTES from '@/constants/routes';
import UserAvatar from './UserAvatar';

const Navbar = () => {
	const auth = useAuth();
	const user = auth?.currentUser;

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
				{!user ? (
					<Link
						href={ROUTES.SIGN_IN}
						className="font-bold tracking-[8px] uppercase"
					>
						<span className="absolute inset-0"></span>
						Sign In
					</Link>
				) : (
					<UserAvatar user={user} />
				)}
			</div>
		</nav>
	);
};

export default Navbar;
