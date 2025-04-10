'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import { useAuth } from '@/context/Auth';

const Navbar = () => {
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
				<UserAvatar />
			</div>
		</nav>
	);
};

export default Navbar;
