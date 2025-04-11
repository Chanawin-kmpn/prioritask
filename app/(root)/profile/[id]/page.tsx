import React from 'react';

const ProfilePage = async ({ params }: RouteParams) => {
	const { id } = await params;
	return <div>ProfilePage: {id}</div>;
};

export default ProfilePage;
