'use client';
import React, { useEffect, useState } from 'react';
import TaskForm from '../forms/TaskForm';
import { Task, TaskPriority } from '@/types/global';
import { useRouter } from 'next/navigation';

interface MatrixProps {
	priorityType: TaskPriority;
	customBorder: string;
	dotColor: string; // สีของ task ในแต่ละ quadrant (optional)
	tasks: Task[];
	isGuest?: boolean;
}

// ดึง task มาเฉพาะที่ตรงกับ priorityType
const Matrix = ({
	priorityType,
	customBorder,
	dotColor,
	tasks: initialTasks,
	isGuest,
}: MatrixProps) => {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);

	useEffect(() => {
		// อัปเดต tasks กับ initialTasks เมื่อ component ได้รับการ mount
		setTasks(initialTasks);
	}, [initialTasks]); // ใช้ initialTasks เป็น dependency

	useEffect(() => {
		// ตรวจสอบว่าผู้ใช้เป็น guest และไม่ได้มี task
		if (isGuest && tasks.length === 0) {
			const guestTasks = JSON.parse(localStorage.getItem('guestTasks') || '[]');

			// กรอง guestTasks โดย priorityType
			const filteredGuestTasks = guestTasks.filter(
				(task: Task) => task.priority === priorityType
			);
			setTasks(filteredGuestTasks); // อัปเดตสถานะ tasks ด้วย guestTasks ที่ถูกกรอง
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
						<div className={`size-12 rounded-full ${dotColor} border`} />
					)}

					{i === tasks.length && tasks.length < 25 && (
						<TaskForm priorityType={priorityType} setTasks={setTasks} />
					)}
				</div>
			))}
		</div>
	);
};

export default Matrix;
