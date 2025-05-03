'use client';
import React, { useEffect, useState } from 'react';
import TaskForm from '../forms/TaskForm';
import { Task, TaskPriority } from '@/types/global';
import { getLocalStorageWithExpiry } from '@/lib/utils';
import TaskCard from '../cards/TaskCard';
import { taskStatus } from '@/constants';
import LimitDeviceFreeTrialDialog from '../LimitDeviceFreeTrialDialog';

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
	const initialWindowWidth = window.innerWidth;
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [windowWidth, setWindowWidth] = useState(initialWindowWidth);

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

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const renderContent = () => {
		if (isGuest && windowWidth < 1024) {
			return <LimitDeviceFreeTrialDialog />;
		}

		return (
			<TaskForm
				priorityType={priorityType}
				setTasks={setTasks}
				currentTasksCount={tasks.length}
				handleOpenDialog={handleOpenDialog}
			/>
		);
	};

	return (
		<div
			className={`bg-light100_dark800 w-full rounded-[28px] lg:w-fit ${customBorder} space-y-8 px-4 py-8 sm:max-w-none sm:p-8 md:p-16 lg:space-y-0 lg:rounded-none lg:p-0`}
		>
			<div className="text-center lg:hidden">
				<p className="text-3xl sm:text-5xl">{taskStatus[priorityType]}</p>
			</div>
			<div className="relative grid min-h-[311px] min-w-[311px] grid-cols-5 grid-rows-5">
				{Array.from({ length: 25 }).map((_, i) => (
					<div
						key={i}
						className="bg-light200_dark100 z-10 flex aspect-square items-center justify-center border border-gray-100 lg:size-[100px]"
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

						{i === tasks.length && tasks.length < 25 && renderContent()}
						<p className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl text-gray-100/50 uppercase opacity-80 sm:text-7xl">
							{priorityType}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Matrix;
