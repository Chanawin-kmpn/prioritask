import React from 'react';
import UserAvatar from './UserAvatar';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
	return (
		<div className="bg-light200_dark100 z-50 flex w-full flex-col items-center justify-between border-t px-16 py-4 lg:flex-row">
			<div className="">
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
			<div>
				<p>Copyright &copy; Chanawin 2025</p>
			</div>
		</div>
	);
};

export default Footer;
