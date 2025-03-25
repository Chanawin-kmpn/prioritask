import type { Metadata } from 'next';
import { Balsamiq_Sans, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const balsamiqSans = Balsamiq_Sans({
	subsets: ['latin'],
	weight: ['400', '700'],
});

export const metadata: Metadata = {
	title: 'Prioritask',
	description: "An Eisenhow's metrix concept to improve your daily productive",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${balsamiqSans.className} `}>
			<body className={`antialiased`}>{children}</body>
		</html>
	);
}
