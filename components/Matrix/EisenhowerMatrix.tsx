import React from 'react';
import Matrix from './Matrix';
import { getTaskByUser } from '@/lib/actions/task.action';

const EisenhowerMatrix = async () => {
	const { success, data, error } = await getTaskByUser();

	if (!success) {
		// toast.error('Failed to fetch tasks', {
		// 	description: error?.message,
		// });
		console.log('Error', error?.message);
		return;
	}

	const filterPriority = {
		do: data?.filter((task) => task.priority === 'do'),
		schedule: data?.filter((task) => task.priority === 'schedule'),
		delegate: data?.filter((task) => task.priority === 'delegate'),
		delete: data?.filter((task) => task.priority === 'delete'),
	};

	return (
		<div className="relative p-14">
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
					priorityType="do"
					customBorder="border-r border-b border-t-[1px] border-l-[1px] border-t-gray-100 border-l-gray-100"
					dotColor="bg-do"
					tasks={filterPriority.do!}
				/>
				<Matrix
					priorityType="schedule"
					customBorder="border-l border-b border-t-[1px] border-r-[1px] border-t-gray-100 border-r-gray-100"
					dotColor="bg-schedule"
					tasks={filterPriority.schedule!}
				/>
				<Matrix
					priorityType="delegate"
					customBorder="border-r border-t border-b-[1px] border-l-[1px] border-b-gray-100 border-l-gray-100"
					dotColor="bg-delegate"
					tasks={filterPriority.delegate!}
				/>
				<Matrix
					priorityType="delete"
					customBorder="border-l border-t border-b-[1px] border-r-[1px] border-b-gray-100 border-r-gray-100"
					dotColor="bg-delete"
					tasks={filterPriority.delete!}
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

export default EisenhowerMatrix;
