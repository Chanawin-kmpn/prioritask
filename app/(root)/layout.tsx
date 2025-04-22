import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { ReactNode, Suspense } from 'react';
import Loading from './loading';

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="bg-light200_dark100 flex flex-col">
			<Navbar />
			<section className="container mx-auto -mt-[132px] min-h-screen flex-1 pt-[132px]">
				<Suspense fallback={<Loading />}>{children}</Suspense>
			</section>
			<Footer />
		</main>
	);
};

export default layout;
