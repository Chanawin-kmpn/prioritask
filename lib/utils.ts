import {
	ActionType,
	ChartData,
	ChartDataCompletion,
	ChartDataPriority,
	Task,
} from '@/types/global';
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

// ฟังก์ชันเก็บข้อมูลลง localStorage พร้อมกับเวลาหมดอายุ
export function setLocalStorageWithExpiry(
	key: string,
	value: any,
	expiryInDays: number
) {
	const now = new Date();

	// สร้างออบเจ็กต์ที่จะเก็บข้อมูลพร้อมกับ timestamp
	const item = {
		value: value,
		expiry: now.getTime() + expiryInDays * 24 * 60 * 60 * 1000, // คำนวณเวลาหมดอายุ
	};

	localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key: string) {
	const itemStr = localStorage.getItem(key);

	// ถ้าไม่มีข้อมูลจะส่งออก null
	if (!itemStr) {
		return [];
	} // คืนค่าเป็น array ว่าง

	const item = JSON.parse(itemStr);
	const now = new Date();

	// ตรวจสอบว่าข้อมูลหมดอายุหรือยัง
	if (now.getTime() > item.expirationDate) {
		// หากหมดอายุแล้วให้นำข้อมูลออกจาก localStorage
		localStorage.removeItem(key);
		return []; // คืนค่าเป็น array ว่างเพราะหมดอายุ
	}

	return item; // คืนค่า value ถ้ายังไม่หมดอายุ
}

export const deleteTaskFromLocalStorage = (taskId: string) => {
	const tasks = JSON.parse(localStorage.getItem('guestTasks')!) || [];
	const filteredTasks = tasks.filter((task: Task) => task.id !== taskId);
	localStorage.setItem('guestTasks', JSON.stringify(filteredTasks));
};

export const convertTimestampToDate = (timestamp: {
	_seconds: number;
	_nanoseconds: number;
}): Date => {
	return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

const getFormattedDate = (day: number, month: number): string => {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	return `${day} ${monthNames[month]}`;
};

const getDaysInMonth = (month: number, year: number): number => {
	return new Date(year, month + 1, 0).getDate(); // คืนค่าจำนวนวันในเดือน
};

export const chartDataGenerater = (
	taskData: Task[],
	dataType: string
): ChartDataCompletion[] | ChartDataPriority[] => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth(); // เดือนปัจจุบัน (0-11)
	const currentYear = currentDate.getFullYear();
	let chartData: ChartData[] = [];

	// สร้างโครงสร้างสำหรับวันที่ทั้งหมดในเดือน
	for (let day = 1; day <= getDaysInMonth(currentMonth, currentYear); day++) {
		const formattedDate = getFormattedDate(day, currentMonth);
		chartData.push({
			date: formattedDate,
			complete: 0,
			incomplete: 0,
			do: 0,
			schedule: 0,
			delegate: 0,
			delete: 0,
		});
	}

	if (dataType === 'completion') {
		taskData.forEach((task) => {
			const taskDate = new Date(task.dueDate);

			if (
				taskDate.getMonth() === currentMonth &&
				taskDate.getFullYear() === currentYear
			) {
				const day = taskDate.getDate();
				const formattedDate = getFormattedDate(day, currentMonth);
				const existingData = chartData.find(
					(item) => item.date === formattedDate
				) as ChartDataCompletion | undefined;

				if (existingData) {
					existingData.complete += task.status === 'complete' ? 1 : 0;
					existingData.incomplete += task.status === 'incomplete' ? 1 : 0;
				}
			}
		});
		return chartData as ChartDataCompletion[];
	} else if (dataType === 'priority') {
		const priorityData: Record<string, Record<string, number>> = {};

		taskData.forEach((task) => {
			const taskDate = new Date(task.dueDate);
			if (
				taskDate.getMonth() === currentMonth &&
				taskDate.getFullYear() === currentYear
			) {
				const day = taskDate.getDate();
				const formattedDate = getFormattedDate(day, currentMonth);
				const priority = task.priority;

				if (!priorityData[formattedDate]) {
					priorityData[formattedDate] = {
						do: 0,
						schedule: 0,
						delegate: 0,
						delete: 0,
					};
				}
				if (priorityData[formattedDate][priority] !== undefined) {
					priorityData[formattedDate][priority] += 1;
				}
			}
		});

		for (const date in priorityData) {
			const existingData = chartData.find((item) => item.date === date) as
				| ChartDataPriority
				| undefined;
			if (existingData) {
				existingData.do += priorityData[date].do || 0;
				existingData.schedule += priorityData[date].schedule || 0;
				existingData.delegate += priorityData[date].delegate || 0;
				existingData.delete += priorityData[date].delete || 0;
			}
		}
		return chartData as ChartDataPriority[];
	}
	return [];
};
