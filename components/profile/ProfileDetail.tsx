import React from 'react';
import EditProfileForm from '../forms/EditProfileForm';
import ProfileDelete from './ProfileDelete';
import ProfileIndentity from './ProfileIndentity';

const ProfileDetail = ({
	id,
	username,
	email,
	providerType,
	photoURL,
	createdAt,
}: {
	id: string;
	username: string;
	email: string;
	providerType: string;
	photoURL: string;
	createdAt: Date;
}) => {
	return (
		<>
			<EditProfileForm
				id={id}
				username={username ?? ''}
				email={email ?? ''}
				providerType={providerType}
			/>
			<ProfileIndentity
				email={email ?? ''}
				providerType={providerType}
				createdAt={createdAt}
			/>
			<ProfileDelete
				id={id}
				username={username ?? ''}
				photoURL={photoURL ?? ''}
			/>
		</>
	);
};

export default ProfileDetail;
