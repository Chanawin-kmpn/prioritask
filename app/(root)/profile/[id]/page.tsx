import { useAuth } from '@/context/Auth';
import React from 'react';

//? หลักๆหน้านี้ใช้ auth.currentUser ในแสดงและแก้ไขข้อมูลยกเว้นแก้ displayname และ update เวลาที่แก้ไข ต้องแก้ใน database ด้วย

const ProfilePage = async ({ params }: RouteParams) => {
	const { id } = await params;
	return <div>ProfilePage: {id}</div>;
};

export default ProfilePage;
