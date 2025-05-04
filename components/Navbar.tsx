'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/Auth';
import ROUTES from '@/constants/routes';
import UserAvatar from './UserAvatar';
import { LogIn } from 'lucide-react';

const Navbar = () => {
	const auth = useAuth();
	const user = auth?.currentUser;

	return (
		<nav className="bg-light200_dark100 relative z-50 flex w-full">
			<div className="flex-1 border-b py-4 pl-4 lg:pl-16">
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
			<div className="border-dark-100 dark:border-light-200 bg-light200_dark100 flex items-center justify-center border-b lg:relative lg:min-w-[300px] lg:border-l">
				{!user ? (
					<Link
						href={ROUTES.SIGN_IN}
						className="pr-4 font-bold tracking-[8px] uppercase lg:p-0"
					>
						<span className="lg:absolute lg:inset-0"></span>
						<span className="lg:hidden">
							<LogIn />
						</span>
						<span className="hidden lg:block">Sign In</span>
					</Link>
				) : (
					<UserAvatar user={user} />
				)}
			</div>
		</nav>
	);
};

export default Navbar;
