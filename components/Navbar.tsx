'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import UserAvatar from './UserAvatar';

const Navbar = () => {
	const isLogin = true;
	return (
		<nav className="bg-light200_dark100 z-50 flex w-full justify-between border-b py-4 pl-16">
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
					<UserAvatar id={'1'} name={'Chanawin Kamolpanus'} />
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
