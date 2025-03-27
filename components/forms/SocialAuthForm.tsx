import React from 'react';
import { Button } from '../ui/button';

const SocialAuthForm = () => {
	return (
		<div>
			<Button
				type="button"
				variant="outline"
				className="flex w-full items-center justify-center rounded-md border border-gray-300 py-2"
			>
				Sign up with Google
			</Button>
		</div>
	);
};

export default SocialAuthForm;
