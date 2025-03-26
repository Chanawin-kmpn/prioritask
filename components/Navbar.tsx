import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import UserAvatar from './UserAvatar';

const Navbar = () => {
	const isLogin = false;
	return (
		<nav className="bg-light200_dark100 fixed z-50 flex w-full justify-between border-b p-4 px-16">
			<Link href="/" className="flex items-center">
				<Image
					src="/images/prioratask-logo.png"
					width={250}
					height={100}
					alt="Prioritask Logo"
				/>
			</Link>
			<div className="border-dark-100 dark:border-light-200 flex min-w-[300px] items-center justify-center border-l px-4">
				{isLogin ? (
					<UserAvatar />
				) : (
					<Link href="/sign-in" className="font-bold tracking-[8px]">
						Sign In
					</Link>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
