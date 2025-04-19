import { ActionType } from '@/types/global';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
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

export const rateLimitCheck = (
	action: ActionType,
	identifier: string
): { limited: boolean; remainingMinutes?: number } => {
	// กำหนดค่าตามประเภทการกระทำ
	const limits = {
		PROFILE_UPDATE: { maxAttempts: 3, timeWindowMs: 60 * 60 * 1000 }, // 60 นาที
		PASSWORD_CHANGE: { maxAttempts: 3, timeWindowMs: 60 * 60 * 1000 }, // 60 นาที
		PASSWORD_RESET: { maxAttempts: 3, timeWindowMs: 60 * 60 * 1000 }, // 60 นาที
	};

	const { maxAttempts, timeWindowMs } = limits[action];
	const key = `rateLimit_${action}_${identifier}`;
	const now = Date.now();

	try {
		// ดึงข้อมูลเดิม
		const stored = localStorage.getItem(key);
		let data = stored ? JSON.parse(stored) : { count: 0, startTime: now };

		// รีเซ็ตถ้าหมดช่วงเวลา
		if (now - data.startTime > timeWindowMs) {
			data = { count: 0, startTime: now };
		}

		// เช็คว่าเกินจำกัดหรือไม่
		if (data.count >= maxAttempts) {
			const remainingMs = data.startTime + timeWindowMs - now;
			const remainingMinutes = Math.ceil(remainingMs / 60000);
			return { limited: true, remainingMinutes };
		}

		// บันทึกจำนวนครั้งที่เพิ่มขึ้น
		data.count += 1;
		localStorage.setItem(key, JSON.stringify(data));

		return { limited: false };
	} catch (e) {
		// กรณีมีปัญหากับ localStorage หรือ JSON parsing
		console.error('Rate limit check error', e);
		return { limited: false }; // อนุญาตให้ทำต่อไปได้หากมีข้อผิดพลาด
	}
};
