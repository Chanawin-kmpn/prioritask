import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface UserAvatarProps {
	id: string;
	name: string;
	imageUrl?: string | null;
	className?: string;
}

const UserAvatar = ({
	id,
	name,
	imageUrl,
	className = 'size-16',
}: UserAvatarProps) => {
	const initials = name
		.split(' ')
		.map((word: string) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<Link href={}>
			<Avatar>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={name}
						className="object-cover"
						width={64}
						height={64}
						quality={100}
					/>
				) : (
					<AvatarFallback
						className={cn(
							'bg-dark100_light200 text-dark100_light100 font-bold tracking-wider'
						)}
					>
						{initials}
					</AvatarFallback>
				)}
			</Avatar>
		</Link>
	);
};

export default UserAvatar;
