import { avatarTextGenerate, cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import DeleteDialog from './DeleteAccountDialog';

const ProfileDelete = ({
	id,
	username,
	photoURL,
}: {
	id: string;
	username: string;
	photoURL: string;
}) => {
	const initials = avatarTextGenerate(username);
	return (
		<div className="bg-light-100 rounded-[28px] border border-gray-100 p-8 dark:bg-zinc-800">
			<div className="flex flex-col gap-4 lg:gap-8">
				<div className="flex flex-col justify-between gap-4 p-4 lg:flex-row lg:items-center lg:gap-12">
					<div className="flex-1 space-y-4">
						<h2 className="text-red-500">Delete Account</h2>
						<p>
							This action will permanently delete your account and all your
							tasks. Cannot be undone.
						</p>
					</div>
					<div className="flex flex-1 items-center gap-8">
						<Avatar className="size-12">
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
										'bg-dark100_light200 text-light200_dark100 pointer-events-none text-xl font-bold tracking-wider'
									)}
								>
									{initials}
								</AvatarFallback>
							)}
						</Avatar>
						<p className="text-dark100_light200 text-xl">{username}</p>
					</div>
				</div>
				<div className="divider" />
				<DeleteDialog username={username} id={id} />
			</div>
		</div>
	);
};

export default ProfileDelete;
