import { Label } from '@radix-ui/react-label';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';

const ThemeToggle = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// รอให้คอมโพเนนต์เรนเดอร์บนฝั่งไคลเอนต์ก่อน
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleThemeChange = (selectedTheme: string) => {
		setTheme(selectedTheme);
		toast.success('Hello');
	};

	if (!mounted) return null;

	return (
		<RadioGroup
			defaultValue={theme}
			onValueChange={handleThemeChange}
			className="flex justify-evenly"
		>
			<Label
				className="flex cursor-pointer flex-col items-center gap-4"
				htmlFor="light"
			>
				<div className="bg-light-200 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300">
					<span className="font-semibold text-black">Aa</span>
				</div>
				<RadioGroupItem value="light" id="light" />
			</Label>
			<Label
				className="flex cursor-pointer flex-col items-center gap-4"
				htmlFor="dark"
			>
				<div className="bg-dark-100 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300">
					<span className="font-semibold text-white">Aa</span>
				</div>{' '}
				<RadioGroupItem value="dark" id="dark" />
			</Label>
			<Label
				className="flex cursor-pointer flex-col items-center gap-4"
				htmlFor="system"
			>
				<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-gray-300">
					<div className="flex h-full w-full">
						<div className="bg-light-200 flex w-1/2 items-center justify-center"></div>
						<div className="bg-dark-100 flex w-1/2 items-center justify-center"></div>
					</div>
					<div className="absolute">
						<span className="text-dark-100 font-semibold">A</span>
						<span className="text-light-100 font-semibold">a</span>
					</div>
				</div>
				<RadioGroupItem value="system" id="system" />
			</Label>
		</RadioGroup>
	);
};

export default ThemeToggle;
