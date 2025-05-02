'use client';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { avatarTextGenerate, cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import DropdownMenu from './DropdownMenu';
import { useAuth } from '@/context/Auth';
import ROUTES from '@/constants/routes';
import { User } from 'firebase/auth';

interface UserAvatarProps {
	user: User;
	className?: string;
	menuItems?: { label: string; href: string }[];
}

const UserAvatar = ({
	className = 'size-12',
	menuItems = [],
}: UserAvatarProps) => {
	const auth = useAuth();
	const user = auth?.currentUser;
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { uid, displayName: username, photoURL } = user!;

	let initials: string = '';
	if (username) {
		initials = avatarTextGenerate(username);
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
		<div ref={dropdownRef} className="mx-auto flex size-full items-center px-4">
			<button
				className="flex size-full cursor-pointer items-center gap-2"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-haspopup="menu"
			>
				<div className="flex flex-1 items-center justify-center gap-4">
					<Avatar className={className}>
						{photoURL ? (
							<Image
								src={photoURL}
								alt={`${username} Image` || 'Profile Image'}
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
					<p className="text-dark100_light200 hidden text-base md:block">
						{username}
					</p>
				</div>
				<ChevronDown
					className={cn(
						'text-dark100_light200 hidden transition-transform duration-200 md:block',
						isOpen ? 'rotate-180' : 'rotate-0'
					)}
				/>
			</button>
			<DropdownMenu isOpen={isOpen} id={uid} onLinkClick={closeDropdown} />
		</div>
	);
};

export default UserAvatar;
