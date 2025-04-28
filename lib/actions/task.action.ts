'use server';
import { firestore } from '@/firebase/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import action from '@/handler/action';
import handleError from '@/handler/error';
import {
	CreateTaskParams,
	DeleteTaskByIdParams,
	DeleteTaskFromDashboardParams,
	EditTaskParams,
	GetTaskByUserParams,
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
	DeleteTaskFromDashboardSchema,
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

export async function getTaskByUser(
	params: GetTaskByUserParams
): Promise<ActionResponse<{ tasks: Task[]; isNext: boolean }>> {
	const validationResult = await action({
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { page = 1, pageSize = 10 } = params;
	const skip = (Number(page) - 1) * Number(pageSize);
	const limit = pageSize;
	const {
		createdAt: createdAtFilter,
		priorityStatus,
		priorityType,
	} = params.filter || {};

	try {
		const userId = validationResult.user?.uid;

		// เริ่มต้น Query
		let query = firestore.collection('tasks').where('userId', '==', userId);

		// เพิ่มฟิลเตอร์ตามที่ได้รับ
		if (createdAtFilter) {
			if (createdAtFilter === 'newest') {
				query = query.orderBy('createdAt', 'desc');
			} else if (createdAtFilter === 'oldest') {
				query = query.orderBy('createdAt', 'asc');
			}
		}

		if (priorityStatus) {
			query = query.where('status', '==', priorityStatus);
		}

		if (priorityType) {
			query = query.where('priority', '==', priorityType);
		}

		// ดึงข้อมูลตาม query
		const tasksData = await query.limit(limit).offset(skip).get();
		const tasks: Task[] = tasksData.docs.map((data) => ({
			...(data.data() as Task),
			id: data.id,
		}));

		const currentDate = new Date();

		const expiredTasks = tasks.filter((task) => {
			return task.expirationDate
				? new Date(task.expirationDate) < currentDate
				: false;
		});

		const tasksToDelete = expiredTasks.filter((task) => {
			return (
				task.status === ('complete' as TaskStatus) ||
				task.status === ('delete' as TaskStatus) ||
				task.status === ('incomplete' as TaskStatus)
			);
		});

		const deletePromises = tasksToDelete.map((task) => {
			return firestore.collection('tasks').doc(task.id).delete();
		});
		await Promise.all(deletePromises); // รอให้ Task ทั้งหมดถูกลบ

		// กรอง Task ที่เหลือจะเก็บ Task ที่ยังไม่หมดอายุและมีสถานะเป็น "on-process"
		const remainingTasks = tasks.filter(
			(task) => !expiredTasks.some((expiredTask) => expiredTask.id === task.id)
		);

		const updatePromises = remainingTasks.map(async (task) => {
			const dueDate = new Date(normalize(task.dueDate));

			// ถ้าไม่มี dueTime ให้ตั้งเวลาเป็น 00:00
			const dueTime = task.dueTime
				? new Date(
						dueDate.setHours(
							Number(task.dueTime.split(':')[0]),
							Number(task.dueTime.split(':')[1])
						)
					)
				: new Date(dueDate.setHours(23, 59)); // ใช้เวลา 23:59 ถ้าไม่มี dueTime

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
		// นับจำนวน Task ที่ตรงตามเงื่อนไขฟิลเตอร์
		const totalTasksSnapshot = await query.get(); // ใช้ query เดียวกันเพื่อดึงจำนวนเอกสารทั้งหมด
		const totalTasks = totalTasksSnapshot.size; // นับจำนวน Task ที่ตรงตามฟิลเตอร์

		const isNext = totalTasks > skip + tasks.length; // ตรวจสอบว่ามีหน้าถัดไปหรือไม่

		const normalizeTask = await normalize(updatedTasks);

		return {
			success: true,
			data: { tasks: JSON.parse(JSON.stringify(normalizeTask)), isNext },
		};
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

export async function deleteTaskFromDashboard(
	params: DeleteTaskFromDashboardParams
): Promise<ActionResponse> {
	const validationResult = await action({
		params,
		schema: DeleteTaskFromDashboardSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { taskId } = validationResult.params!;
	const userId = validationResult.user?.uid;

	if (!userId) {
		return {
			success: false,
			error: {
				message: 'User not found!',
			},
		};
	}

	try {
		const taskSnapshot = await firestore.collection('tasks').doc(taskId).get();

		if (!taskSnapshot.exists) {
			return {
				success: false,
				error: {
					message: 'Task not found!',
				},
			};
		}

		// Delete the task from the dashboard
		await firestore.collection('tasks').doc(taskId).delete();

		const userSnapshot = await firestore.collection('users').doc(userId).get();

		if (!userSnapshot.exists) {
			return {
				success: false,
				error: {
					message: 'User not found!',
				},
			};
		}

		// Remove taskId from user's tasks
		await firestore
			.collection('users')
			.doc(userId)
			.update({
				tasks: FieldValue.arrayRemove(taskId),
			});

		revalidatePath(ROUTES.DASHBOARD);
		return { success: true };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
