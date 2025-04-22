'use client';
import React, { useState } from 'react';
import Matrix from './Matrix';
import { useAuth } from '@/context/Auth';
import TaskLimitAlertDialog from '../TaskLimitAlertDialog';
import { Button } from '../ui/button';

const GuestEisenhowerMatrix = () => {
	const [open, setOpen] = useState(false);
	const [currentPriorityType, setCurrentPriorityType] = useState('');
	const [currentTaskCount, setCurrentTaskCount] = useState(0);
	const auth = useAuth();
	const isGuest = !auth?.currentUser;

	if (!isGuest) return null;

	const handleOpenDialog = (priorityType: string, taskCount: number) => {
		setCurrentPriorityType(priorityType);
		setCurrentTaskCount(taskCount);
		setOpen(true);
	};

	return (
		<div className="relative p-14">
			<TaskLimitAlertDialog
				open={open}
				setOpen={setOpen}
				priorityType={currentPriorityType}
				taskCount={currentTaskCount}
			/>
			<div className="absolute top-0 flex w-full max-w-[1000px] text-center">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Urgent
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Urgent
				</span>
			</div>
			<div className="grid w-fit grid-cols-2 justify-center">
				<Matrix
					isGuest={isGuest}
					priorityType="do"
					customBorder="border-r border-b border-t-[1px] border-l-[1px] border-t-gray-100 border-l-gray-100"
					dotColor="bg-do"
					tasks={[]}
					handleOpenDialog={handleOpenDialog}
				/>
				<Matrix
					isGuest={isGuest}
					priorityType="schedule"
					customBorder="border-l border-b border-t-[1px] border-r-[1px] border-t-gray-100 border-r-gray-100"
					dotColor="bg-schedule"
					tasks={[]}
					handleOpenDialog={handleOpenDialog}
				/>
				<Matrix
					isGuest={isGuest}
					priorityType="delegate"
					customBorder="border-r border-t border-b-[1px] border-l-[1px] border-b-gray-100 border-l-gray-100"
					dotColor="bg-delegate"
					tasks={[]}
					handleOpenDialog={handleOpenDialog}
				/>
				<Matrix
					isGuest={isGuest}
					priorityType="delete"
					customBorder="border-l border-t border-b-[1px] border-r-[1px] border-b-gray-100 border-r-gray-100"
					dotColor="bg-delete"
					tasks={[]}
					handleOpenDialog={handleOpenDialog}
				/>
			</div>
			<div className="absolute bottom-0 left-0 flex w-full max-w-[1000px] origin-top-left -rotate-90 text-center">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Important
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Important
				</span>
			</div>
		</div>
	);
};

export default GuestEisenhowerMatrix;
