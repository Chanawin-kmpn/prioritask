import EisenhowerMatrix from '@/components/matrix/EisenhowerMatrix';
import { Suspense } from 'react';
import Loading from './loading';

export default function Home() {
	return (
		<main className="bg-light200_dark100 flex h-full justify-center py-32">
			<Suspense fallback={<Loading />}>
				<EisenhowerMatrix />
			</Suspense>
		</main>
	);
}
