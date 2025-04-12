import ProfileDetail from '@/components/profile/ProfileDetail';
import { getUserById } from '@/lib/actions/auth.action';
import React from 'react';
import { toast } from 'sonner';

//? หลักๆหน้านี้ใช้ auth.currentUser ในแสดงและแก้ไขข้อมูลยกเว้นแก้ displayname และ update เวลาที่แก้ไข ต้องแก้ใน database ด้วย

const ProfilePage = async ({ params }: RouteParams) => {
	const { id } = await params;
	const { success, data } = await getUserById({ id });
	if (!success) {
		toast.error('Failed to fetch user data');
	}
	const { uid, username, email, providerType } = data?.user! || {};

	return (
		<div className="py-32">
			<h1>Account</h1>
			<ProfileDetail
				uid={uid}
				username={username}
				email={email}
				providerType={providerType}
			/>
		</div>
	);
};

export default ProfilePage;
