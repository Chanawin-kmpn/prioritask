import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
	return (
		<nav className="bg-light200_dark100  flex  justify-between fixed z-50 w-full p-4 px-16">
			<Link href="/" className="flex items-center">
				<Image
					src="/images/prioratask-logo.png"
					width={250}
					height={100}
					alt="Prioritask Logo"
				/>
			</Link>
			<div className="border-l "></div>
		</nav>
	);
};

export default Navbar;
