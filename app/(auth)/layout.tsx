import Image from 'next/image';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="mx-8 flex w-4xl rounded-[28px] bg-zinc-200 p-4 lg:min-h-[772px] dark:bg-zinc-800">
				<section className="relative hidden w-1/2 overflow-hidden rounded-l-[12px] md:block">
					<Image
						src="/images/light-auth-banner.png"
						alt="Prioritask Demo"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 50vw"
						className="bg-light-100 object-contain object-left dark:hidden"
					/>
					<Image
						src="/images/dark-auth-banner.png"
						alt="Prioritask Demo"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 50vw"
						className="hidden h-fit bg-zinc-900 object-contain object-left dark:block"
					/>
				</section>
				<section className="w-full md:w-1/2">{children}</section>
			</div>
		</div>
	);
};

export default layout;
