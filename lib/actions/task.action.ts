'use server';
import { firestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import action from '@/handler/action';
import handleError from '@/handler/error';
import { CreateTaskParams } from '@/types/action';
import { ActionResponse, ErrorResponse, Task } from '@/types/global';
import { TaskFormSchema } from '@/validations/validations';
import { UnauthorizedError } from '../http-errors';

export async function createTask(
	params: CreateTaskParams
): Promise<ActionResponse<Task>> {
	const validationResult = await action({
		params,
		schema: TaskFormSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { name, description, dueDate, dueTime, priority, status, notify } =
		validationResult.params!;
	const userId = validationResult.user?.uid;

	try {
		const now = FieldValue.serverTimestamp();
		if (!userId) {
			return {
				success: false,
				error: { message: 'Unauthorized' },
			};
		}
		const task = await firestore.collection('tasks').add({
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
				tasks: FieldValue.arrayUnion(task.id), //เป็นวิธีมาตรฐานของ Firestore ในการ push ค่าเข้า array โดยไม่สร้าง duplicated write / race condition
			});

		await task.update({ id: task.id });
		return { success: true, data: JSON.parse(JSON.stringify(task)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
