import EisenhowerMatrix from '@/components/matrix/EisenhowerMatrix';
export const revalidate = 0;
export default function Home() {
	return (
		<main className="bg-light200_dark100 flex h-full justify-center py-32">
			<EisenhowerMatrix />
		</main>
	);
}
