import type { Metadata } from 'next';
import { Balsamiq_Sans } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/context/Theme';

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
		<html
			lang="en"
			className={`${balsamiqSans.className} `}
			suppressHydrationWarning
		>
			<body className={`antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
