import { ReactNode } from 'react';

export default function Home({ children }: { children: ReactNode }) {
	return <main className="bg-light200_dark100">{children}</main>;
}
