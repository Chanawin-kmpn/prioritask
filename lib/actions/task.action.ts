'use server';
import { firestore } from '@/firebase/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import action from '@/handler/action';
import handleError from '@/handler/error';
import {
	CreateTaskParams,
	DeleteTaskByIdParams,
	EditTaskParams,
	SetTaskToCompleteParams,
} from '@/types/action';
import {
	ActionResponse,
	ErrorResponse,
	Task,
	TaskStatus,
} from '@/types/global';
import {
	CreateTaskSchema,
	DeleteTaskByTaskIdSchema,
	EditTaskSchema,
	SetTaskToCompleteSchema,
} from '@/validations/validations';
import { revalidatePath } from 'next/cache';
import ROUTES from '@/constants/routes';
import { EXPIRATION_TASK_DATE } from '@/constants/constants';
import { convertTimestampToDate } from '../utils';

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
				id: 'guest-' + Date.now(),
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
		await taskRef.update({
			id: taskRef.id,
		});
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
			.orderBy('createdAt', 'asc')
			.get();

		const tasks: Task[] = query.docs.map((data) => ({
			// id: data.id, // เพิ่ม ID เพื่อใช้ในการลบ
			...(data.data() as Task),
		}));

		// ตรวจสอบวันหมดอายุ
		const currentDate = new Date();

		// Task ที่หมดอายุ
		const expiredTasks = tasks.filter((task) => {
			return task.expirationDate
				? new Date(task.expirationDate) < currentDate
				: false;
		});

		// Task ที่มีสถานะเป็น "complete", "delete", หรือ "incomplete" ที่หมดอายุ
		const tasksToDelete = expiredTasks.filter((task) => {
			return (
				task.status === ('complete' as TaskStatus) ||
				task.status === ('delete' as TaskStatus) ||
				task.status === ('incomplete' as TaskStatus)
			);
		});

		// ลบ Task ที่หมดอายุ
		const deletePromises = tasksToDelete.map((task) => {
			return firestore.collection('tasks').doc(task.id).delete();
		});
		await Promise.all(deletePromises); // รอให้ Task ทั้งหมดถูกลบ

		// กรอง Task ที่เหลือ จะเก็บ Task ที่ยังไม่หมดอายุและมีสถานะเป็น "on-process"

		const remainingTasks = tasks.filter((task) => {
			return !expiredTasks.some((expiredTask) => expiredTask.id === task.id);
		});

		const updatePromises = remainingTasks.map(async (task) => {
			const dueDate = new Date(task.dueDate);
			// ถ้าไม่มี dueTime ให้ตั้งเวลาเป็น 00:00
			const dueTime = task.dueTime
				? new Date(
						dueDate.setHours(
							Number(task.dueTime.split(':')[0]),
							Number(task.dueTime.split(':')[1])
						)
					)
				: new Date(dueDate.setHours(0, 0)); // ใช้เวลา 00:00 ถ้าไม่มี dueTime

			if (dueTime <= currentDate && task.status === 'on-progress') {
				// อัปเดตสถานะเป็น "incomplete"
				await firestore.collection('tasks').doc(task.id).update({
					status: 'incomplete',
				});
				return { ...task, status: 'incomplete' }; // อัปเดตสถานะใน Task object
			}

			return task; // คืนค่า Task ถ้าไม่ต้องอัปเดต
		});

		const updatedTasks = await Promise.all(updatePromises); // รอให้การอัปเดตเสร็จสิ้น

		const normalizeTasks = normalize(updatedTasks);
		return { success: true, data: JSON.parse(JSON.stringify(normalizeTasks)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function setTaskToComplete(
	params: SetTaskToCompleteParams
): Promise<ActionResponse> {
	const validationResult = await action({
		params,
		schema: SetTaskToCompleteSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { taskId } = validationResult.params!;
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + EXPIRATION_TASK_DATE);
	try {
		const taskSnapshot = await firestore
			.collection('tasks')
			.where('id', '==', taskId)
			.get();

		if (taskSnapshot.empty) {
			return {
				success: false,
				error: {
					message: 'Task not found!',
				},
			};
		}

		const currentTaskStatus = taskSnapshot.docs[0].data();

		if (currentTaskStatus.status === 'complete') {
			return {
				success: false,
				error: {
					message: 'Task is already marked as complete!',
				},
			};
		}

		const now = FieldValue.serverTimestamp();

		await firestore.collection('tasks').doc(taskId).update({
			status: 'complete',
			completedAt: now,
			expirationDate,
		});

		revalidatePath(ROUTES.HOME);
		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function deleteTaskByTaskId(
	params: DeleteTaskByIdParams
): Promise<ActionResponse> {
	const validationResult = await action({
		params,
		schema: DeleteTaskByTaskIdSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { taskId, userId } = validationResult.params!;

	try {
		if (!userId) {
			return {
				success: false,
				error: {
					message: 'Unauthorize',
				},
			};
		}

		const tasksSnapshot = await firestore
			.collection('tasks')
			.where('id', '==', taskId)
			.get();

		if (tasksSnapshot.empty) {
			return {
				success: false,
				error: {
					message: 'Task not found!',
				},
			};
		}

		const userSnapshot = await firestore
			.collection('users')
			.where('uid', '==', userId)
			.get();

		if (userSnapshot.empty) {
			return {
				success: false,
				error: {
					message: 'User not found!',
				},
			};
		}

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);

		// await firestore.collection('tasks').doc(taskId).delete();
		await firestore.collection('tasks').doc(taskId).update({
			status: 'delete',
			expirationDate,
		});
		// const userDoc = userSnapshot.docs[0]; //เก็บ user doc แรกที่ตรงกัน
		// await firestore
		// 	.collection('users')
		// 	.doc(userDoc.id)
		// 	.update({
		// 		tasks: FieldValue.arrayRemove(taskId),
		// 	});

		revalidatePath(ROUTES.HOME);
		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}

export async function editTask(
	params: EditTaskParams
): Promise<ActionResponse<Task>> {
	const validationResult = await action({ params, schema: EditTaskSchema });

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const {
		taskId,
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
		if (!userId) {
			const updatedTasks = {
				name,
				description,
				dueDate,
				dueTime,
				priority,
				status,
				notify,
				updatedAt: now,
			};
			return { success: true, data: JSON.parse(JSON.stringify(updatedTasks)) };
		}
		const taskSnapshot = await firestore.collection('tasks').doc(taskId).get();
		if (!taskSnapshot.exists) {
			return {
				success: false,
				error: {
					message: 'Task not found',
				},
			};
		}

		const currentTask = taskSnapshot.data() as Task;

		const updatesData: Partial<Task> = {};

		// เช็คการเปลี่ยนแปลงในแต่ละฟิลด์
		if (currentTask.name !== name) updatesData.name = name;
		if (currentTask.description !== description)
			updatesData.description = description;
		if (currentTask.dueDate !== dueDate) updatesData.dueDate = dueDate;
		if (currentTask.dueTime !== dueTime) updatesData.dueTime = dueTime;
		if (currentTask.priority !== priority) updatesData.priority = priority;
		if (currentTask.status !== status) updatesData.status = status;
		if (currentTask.notify !== notify) updatesData.notify = notify;

		// อัปเดตเฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
		if (Object.keys(updatesData).length > 0) {
			await firestore
				.collection('tasks')
				.doc(taskId)
				.update({
					...updatesData,
					updatedAt: now, // อัปเดตเวลาเมื่อมีการเปลี่ยนแปลง
				});
		}

		revalidatePath(ROUTES.HOME);
		return { success: true, data: JSON.parse(JSON.stringify(currentTask)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
