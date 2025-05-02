'use client';
import ROUTES from '@/constants/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { toast } from 'sonner';
import { useAuth } from '@/context/Auth';

const DropdownMenu = ({
	id,
	isOpen,
	onLinkClick,
}: {
	isOpen: boolean;
	id: string;
	onLinkClick: () => void;
}) => {
	const auth = useAuth();
	return (
		<div
			className={cn(
				'bg-light-200 dark:bg-dark-100 absolute top-full right-0 z-[-10] w-full space-y-4 overflow-hidden border-b p-4 transition-all duration-200 md:min-w-[300px] md:border-t md:border-l',
				isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			)}
		>
			<ul role="menu" className="py-1">
				<li role="menuitem">
					<Link
						onClick={onLinkClick}
						href={ROUTES.PROFILE(id)}
						className="setting-links"
					>
						Your Profile
					</Link>
				</li>
				<li role="menuitem">
					<Link
						onClick={onLinkClick}
						href={ROUTES.DASHBOARD}
						className="setting-links"
					>
						Dashboard
					</Link>
				</li>
				<li role="menuitem">
					<button
						className="setting-links w-full text-start"
						onClick={async () => {
							await auth?.logout();
							toast.success('Logout successfully!!!');
						}}
					>
						Sign out
					</button>
				</li>
			</ul>
			<div className="divider" />
			<ThemeToggle />
		</div>
	);
};

export default DropdownMenu;
