'use server';
import { firestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import action from '@/handler/action';
import handleError from '@/handler/error';
import { CreateTaskParams, GetTaskByUserParams } from '@/types/action';
import { ActionResponse, ErrorResponse, Task } from '@/types/global';
import {
	CreateTaskSchema,
	GetTasksByUserSchema,
} from '@/validations/validations';
import { revalidatePath } from 'next/cache';
import ROUTES from '@/constants/routes';

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
			};

			taskRef = await firestore.collection('tasks').add(guestTask);
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

export async function getTaskByUser(
	params: GetTaskByUserParams
): Promise<ActionResponse<Task[]>> {
	const validationResult = await action({
		params,
		schema: GetTasksByUserSchema,
		// authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	try {
		const { userId } = validationResult.params!;

		if (!userId) {
			return {
				success: false,
				error: { message: 'Unauthorized' },
			};
		}

		const query = await firestore
			.collection('tasks')
			.where('userId', '==', userId)
			.orderBy('createdAt', 'desc')
			.get();

		const tasks: Task[] = query.docs.map((data) => ({
			...(data.data() as Task),
		}));
		revalidatePath(ROUTES.HOME);
		return { success: true, data: JSON.parse(JSON.stringify(tasks)) };
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
