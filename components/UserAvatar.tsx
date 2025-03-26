import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ROUTES from '@/constants/routes';

interface UserAvatarProps {
	id: string;
	name: string;
	imageUrl?: string | null;
	className?: string;
	menuItems?: { label: string; href: string }[];
}

const UserAvatar = ({
	id,
	name,
	imageUrl,
	className = 'size-12',
	menuItems = [],
}: UserAvatarProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const initials = name
		.split(' ')
		.map((word: string) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="flex cursor-pointer items-center justify-between gap-2"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-haspopup="menu"
			>
				<div className="flex items-center gap-4">
					<Avatar className={className}>
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt={name}
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
					<p className="text-dark100_light200 text-base">{name}</p>
				</div>
				<ChevronDown
					className={cn(
						'transition-transform duration-200',
						isOpen ? 'rotate-180' : 'rotate-0'
					)}
				/>
			</button>

			{isOpen && (
				<div className="absolute -right-4 z-10 min-w-[300px] overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-800">
					<ul role="menu" className="py-1">
						<li role="menuitem">
							<Link
								href={ROUTES.PROFILE(id)}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
							>
								Your Profile
							</Link>
						</li>
						<li role="menuitem">
							<Link
								href={ROUTES.DASHBOARD}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
							>
								Dashboard
							</Link>
						</li>
						<li role="menuitem">
							<button>Sign out</button>
						</li>
					</ul>
					<div />
					<p className="">Theme</p>
				</div>
			)}
		</div>
	);
};

export default UserAvatar;
