import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function avatarTextGenerate(username: string) {
	const textImage = username
		.split(' ')
		.map((word: string) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
	return textImage;
}

export function deleteAccountConfirmText(username: string) {
	const confirmText = `delete-${username.toLowerCase().split(' ').join('-')}-account`;

	return confirmText;
}
