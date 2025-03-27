import ROUTES from '@/constants/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import ThemeToggle from './ThemeToggle';

const DropdownMenu = ({
	id,
	isOpen,
	onLinkClick,
}: {
	isOpen: boolean;
	id: string;
	onLinkClick: () => void;
}) => {
	return (
		<div
			className={cn(
				'bg-light-200 dark:bg-dark-100 absolute top-full right-0 z-[-10] min-w-[300px] space-y-4 overflow-hidden border-t border-b border-l p-4 transition-all duration-200',
				isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full'
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
				<li role="menuitem" className="setting-links">
					<button>Sign out</button>
				</li>
			</ul>
			<div className="divider" />
			<ThemeToggle />
		</div>
	);
};

export default DropdownMenu;
