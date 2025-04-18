import ForgetPasswordForm from '@/components/forms/ForgetPasswordForm';
import Image from 'next/image';
import React from 'react';

const page = () => {
	return (
		<div className="flex flex-col justify-center gap-8 px-8">
			<div className="w-full space-y-2">
				<Image
					src="/images/prioritask-logo.png"
					alt="Prioritask Logo"
					width={200}
					height={80}
					className="mx-auto"
				/>

				<div>
					<h2 className="text-center text-3xl font-bold">
						Forgot your password?
					</h2>
					<p className="mt-2 text-center text-sm">
						No worries! Enter your email address and we’ll send you a link to
						reset your password.
					</p>
				</div>
			</div>

			<div className="divider" />
			<ForgetPasswordForm />
		</div>
	);
};

export default page;
