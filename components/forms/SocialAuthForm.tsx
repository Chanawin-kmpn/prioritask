import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

const SocialAuthForm = ({ title }: { title: string }) => {
	return (
		<div>
			<Button
				type="button"
				size="lg"
				variant="outline"
				className="text-dark100_light200 hover:bg-dark-100 hover:text-light-200 dark:hover:bg-light-200 dark:hover:text-dark-100 flex w-full items-center justify-center rounded-md py-4 text-base"
			>
				{title}
				<Image
					src="/icons/google.svg"
					width={16}
					height={16}
					alt="Google Icon"
				/>
			</Button>
		</div>
	);
};

export default SocialAuthForm;
