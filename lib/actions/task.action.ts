'use server';
import { firestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import action from '@/handler/action';
import handleError from '@/handler/error';
import { CreateTaskParams } from '@/types/action';
import { ActionResponse, ErrorResponse, Task } from '@/types/global';
import { TaskFormSchema } from '@/validations/validations';

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

		await task.update({ id: task.id });

		return { success: true, data: JSON.parse(JSON.stringify(task)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
