import ForgetPasswordForm from '@/components/forms/ForgetPasswordForm';
import Image from 'next/image';
import React from 'react';

const page = () => {
	return (
		<div className="flex flex-col justify-center gap-8 px-8">
			<div className="w-full space-y-2">
				<Image
					src="/images/prioritask-logo.png"
					alt="Prioritask-logo"
					width={200}
					height={80}
					className="mx-auto"
				/>

				<div className="space-x-4">
					<h2 className="text-3xl font-bold">Forgot Password?</h2>
					<div className="space-x-4">
						<p className="inline text-sm">
							Don't worry enter your email for get a link for recovery your
							password.
						</p>
					</div>
				</div>
			</div>

			<div className="divider" />
			<ForgetPasswordForm />
		</div>
	);
};

export default page;
