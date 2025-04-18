'use client';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ROUTES from '@/constants/routes';
import DropdownMenu from './DropdownMenu';
import { useAuth } from '@/context/Auth';

interface UserAvatarProps {
	className?: string;
	menuItems?: { label: string; href: string }[];
}

const UserAvatar = ({
	className = 'size-12',
	menuItems = [],
}: UserAvatarProps) => {
	const auth = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// const handleLogout = async () => {
	// 	await auth?.
	// }

	let initials: string = '';
	if (auth?.currentUser && auth.currentUser.displayName) {
		initials = auth.currentUser.displayName
			.split(' ')
			.map((word: string) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	// เพิ่มฟังก์ชันสำหรับปิด dropdown
	const closeDropdown = () => {
		setIsOpen(false);
	};

	// เพิ่ม useEffect สำหรับการจัดการคลิกนอก dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		// เพิ่ม event listener เมื่อ dropdown เปิดอยู่
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		// ลบ event listener เมื่อ component unmount หรือ isOpen เปลี่ยนค่า
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			{!auth?.currentUser ? (
				<Link href="/sign-in" className="font-bold tracking-[8px] uppercase">
					Sign In
				</Link>
			) : (
				<div
					ref={dropdownRef}
					className="mx-auto flex size-full items-center px-4"
				>
					<button
						className="flex size-full cursor-pointer items-center gap-2"
						onClick={() => setIsOpen(!isOpen)}
						aria-expanded={isOpen}
						aria-haspopup="menu"
					>
						<div className="flex flex-1 items-center gap-4">
							<Avatar className={className}>
								{auth?.currentUser.photoURL ? (
									<Image
										src={auth.currentUser.photoURL}
										alt={
											`${auth?.currentUser?.displayName} Image` ||
											'Profile Image'
										}
										className="object-cover"
										width={48}
										height={48}
										quality={100}
									/>
								) : (
									<AvatarFallback
										className={cn(
											'bg-dark100_light200 text-light200_dark100 text-xl font-bold tracking-wider'
										)}
									>
										{initials}
									</AvatarFallback>
								)}
							</Avatar>
							<p className="text-dark100_light200 text-base">
								{auth?.currentUser?.displayName}
							</p>
						</div>
						<ChevronDown
							className={cn(
								'text-dark100_light200 transition-transform duration-200',
								isOpen ? 'rotate-180' : 'rotate-0'
							)}
						/>
					</button>
					<DropdownMenu
						isOpen={isOpen}
						id={auth?.currentUser?.uid || ''}
						onLinkClick={closeDropdown}
						handleLogout={auth.logout}
					/>
				</div>
			)}
		</>
	);
};

export default UserAvatar;
