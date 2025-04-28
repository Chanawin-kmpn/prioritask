'use client';
import React, { useEffect, useState } from 'react';
import TaskForm from '../forms/TaskForm';
import { Task, TaskPriority } from '@/types/global';
import { getLocalStorageWithExpiry } from '@/lib/utils';
import TaskCard from '../cards/TaskCard';

interface MatrixProps {
	priorityType: TaskPriority;
	customBorder: string;
	dotColor: string;
	tasks: Task[];
	isGuest?: boolean;
	handleOpenDialog?: (priorityType: string, taskCount: number) => void;
	userId?: string;
}

// ดึง task มาเฉพาะที่ตรงกับ priorityType
const Matrix = ({
	priorityType,
	customBorder,
	dotColor,
	tasks: initialTasks,
	isGuest,
	handleOpenDialog,
	userId,
}: MatrixProps) => {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);

	useEffect(() => {
		// อัปเดต tasks กับ initialTasks เมื่อ component ได้รับการ mount
		setTasks(initialTasks.filter((task) => task.status === 'on-progress'));
	}, [initialTasks]); // ใช้ initialTasks เป็น dependency

	useEffect(() => {
		// ตรวจสอบว่าผู้ใช้เป็น guest และไม่ได้มี task
		if (isGuest && tasks.length === 0) {
			const guestTasks = getLocalStorageWithExpiry('guestTasks');

			const currentDate = new Date();
			// กรอง guestTasks โดย priorityType
			const filteredGuestTasks = guestTasks.filter((task: Task) => {
				const isDueDateValid = new Date(task.dueDate) >= currentDate;
				if (!isDueDateValid) {
					return false;
				}
				return task.priority === priorityType;
			});
			const validTasks = guestTasks.filter(
				(task: Task) => new Date(task.dueDate) >= currentDate
			);
			localStorage.setItem('guestTasks', JSON.stringify(validTasks)); // เซฟค่าใหม่กลับไปที่ localStorage
			setTasks(
				filteredGuestTasks.filter((task: Task) => task.status === 'on-progress')
			); // อัปเดตสถานะ tasks ด้วย guestTasks ที่ถูกกรอง
		}
	}, [isGuest, tasks.length, priorityType]); // เพิ่ม priorityType เป็น dependency

	return (
		<div
			className={`relative grid w-fit grid-cols-5 grid-rows-5 ${customBorder}`}
		>
			<p className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl text-gray-100/50 uppercase">
				{priorityType}
			</p>

			{Array.from({ length: 25 }).map((_, i) => (
				<div
					key={i}
					className="z-10 flex size-[100px] items-center justify-center border border-gray-100"
				>
					{i < tasks.length && (
						<TaskCard
							priorityType={priorityType}
							userId={userId || ''}
							dotColor={dotColor}
							task={tasks[i]}
							setTasks={setTasks}
						/>
					)}

					{i === tasks.length && tasks.length < 25 && (
						<TaskForm
							priorityType={priorityType}
							setTasks={setTasks}
							currentTasksCount={tasks.length}
							handleOpenDialog={handleOpenDialog}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default Matrix;
