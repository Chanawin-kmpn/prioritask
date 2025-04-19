import ProfileDetail from '@/components/profile/ProfileDetail';
import { getUserById } from '@/lib/actions/auth.action';
import { RouteParams } from '@/types/global';
import { redirect } from 'next/navigation';
import React, { cache } from 'react';
import { toast } from 'sonner';

//? หลักๆหน้านี้ใช้ auth.currentUser ในแสดงและแก้ไขข้อมูลยกเว้นแก้ displayname และ update เวลาที่แก้ไข ต้องแก้ใน database ด้วย

const getCachedUserById = cache(async (id: string) => {
	return await getUserById({ id });
});

const ProfilePage = async ({ params }: RouteParams) => {
	const { id } = await params;
	const { success, data } = await getCachedUserById(id);
	if (!success) {
		toast.error('Failed to fetch user data');
		redirect('/');
	}

	const { uid, username, email, providerType, photoURL, createdAt } =
		data?.user! || {};

	console.log(data);

	return (
		<div className="space-y-8 py-32">
			<h1 className="text-dark100_light200">Account</h1>
			<div className="space-y-8">
				<ProfileDetail
					id={uid}
					username={username}
					email={email}
					providerType={providerType}
					photoURL={photoURL}
					createdAt={createdAt}
				/>
			</div>
		</div>
	);
};

export default ProfilePage;
