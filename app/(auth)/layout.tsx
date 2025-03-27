import Image from 'next/image';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="bg-light-100 flex w-4xl p-4">
				<section className="relative w-1/2">
					<Image
						src="/images/auth-image.png"
						alt="Prioritask Demo"
						fill
						priority
						sizes="100vw"
						className="object-cover object-left"
					/>
				</section>
				<section className="w-1/2">{children}</section>
			</div>
		</div>
	);
};

export default layout;
