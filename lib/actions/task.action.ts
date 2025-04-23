'use server';
import { firestore } from '@/firebase/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import action from '@/handler/action';
import handleError from '@/handler/error';
import { CreateTaskParams, GetTaskByUserParams } from '@/types/action';
import { ActionResponse, ErrorResponse, Task } from '@/types/global';
import { CreateTaskSchema } from '@/validations/validations';
import { revalidatePath } from 'next/cache';
import ROUTES from '@/constants/routes';

const normalize = (obj: any): any => {
	if (obj instanceof Timestamp) return obj.toMillis();
	if (Array.isArray(obj)) return obj.map(normalize);
	if (obj && typeof obj === 'object') {
		return Object.fromEntries(
			Object.entries(obj).map(([k, v]) => [k, normalize(v)])
		);
	}
	return obj;
};

export async function createTask(
	params: CreateTaskParams
): Promise<ActionResponse<Task>> {
	const validationResult = await action({
		params,
		schema: CreateTaskSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const {
		name,
		description,
		dueDate,
		dueTime,
		priority,
		status,
		notify,
		userId,
	} = validationResult.params!;

	const now = FieldValue.serverTimestamp();
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 7);

	try {
		let taskRef;

		if (userId) {
			taskRef = await firestore.collection('tasks').add({
				userId,
				name,
				description,
				dueDate,
				dueTime,
				priority,
				status,
				notify,
				createdAt: now,
				updatedAt: now,
			});

			await firestore
				.collection('users')
				.doc(userId)
				.update({
					tasks: FieldValue.arrayUnion(taskRef.id),
				});
		} else {
			const guestTask = {
				isPublic: true,
				name,
				description,
				dueDate,
				dueTime,
				priority,
				status,
				notify,
				createdAt: now,
				updatedAt: now,
				expirationDate: expirationDate.toISOString(),
			};

			return { success: true, data: JSON.parse(JSON.stringify(guestTask)) };
		}

		// ดึงข้อมูล Task ที่สร้างขึ้น
		const createdTask = await taskRef.get();
		const taskData = createdTask.data();

		revalidatePath(ROUTES.HOME);
		// คืนค่าข้อมูล Task ที่รวมทั้ง id ที่ได้จาก Firestore
		return {
			success: true,
			data: JSON.parse(JSON.stringify(taskData)),
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function getTaskByUser(): Promise<ActionResponse<Task[]>> {
	const validationResult = await action({
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	try {
		const userId = validationResult.user?.uid;

		const query = await firestore
			.collection('tasks')
			.where('userId', '==', userId)
			.orderBy('createdAt', 'desc')
			.get();

		const tasks: Task[] = query.docs.map((data) => ({
			...(data.data() as Task),
		}));
		const normalizeTasks = normalize(tasks);
		// revalidatePath(ROUTES.HOME);
		return { success: true, data: JSON.parse(JSON.stringify(normalizeTasks)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

// export async function getTaskByLocalStorage(): Promise<ActionResponse<Task[]>> {
// 	try {
// 		const guestTasks = JSON.parse(localStorage.getItem('guestTasks') || '[]'); // ดึงข้อมูลจาก localStorage
// 		return {
// 			success: true,
// 			data: guestTasks,
// 		};
// 	} catch (error) {
// 		return handleError(error) as ErrorResponse;
// 	}
// }
