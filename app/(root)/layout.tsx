import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="bg-light200_dark100 flex flex-col">
			<Navbar />
			<section className="-mt-[132px] min-h-screen flex-1 py-[132px]">
				<div>{children}</div>
			</section>
			<Footer />
		</main>
	);
};

export default layout;
