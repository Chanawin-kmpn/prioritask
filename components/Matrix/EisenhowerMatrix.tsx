import React from 'react';
import { getAllTasksByUser } from '@/lib/actions/task.action';
import { Task } from '@/types/global';
import { toast } from 'sonner';
import Matrix from './Matrix';

interface FilterPriority {
	do: Task[];
	schedule: Task[];
	delegate: Task[];
	delete: Task[];
}

const EisenhowerMatrix = async ({ userId }: { userId: string }) => {
	const { success, data, error } = await getAllTasksByUser();

	if (!success) {
		return null;
	}

	const tasks = data || [];

	const filterPriority: FilterPriority = {
		do: tasks.filter((task) => task.priority === 'do'),
		schedule: tasks.filter((task) => task.priority === 'schedule'),
		delegate: tasks.filter((task) => task.priority === 'delegate'),
		delete: tasks.filter((task) => task.priority === 'delete'),
	};

	return (
		<div className="relative size-full p-4 lg:w-fit lg:p-14">
			<div className="absolute top-0 hidden w-full max-w-[1000px] text-center lg:flex">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Urgent
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Urgent
				</span>
			</div>
			<div className="grid w-full grid-cols-1 justify-center gap-8 lg:grid lg:w-fit lg:grid-cols-2 lg:gap-0">
				<Matrix
					userId={userId}
					priorityType="do"
					customBorder="border-r border-b border-t-[1px] border-l-[1px] border-t-gray-100 border-l-gray-100"
					dotColor="bg-do"
					tasks={filterPriority.do}
				/>
				<Matrix
					userId={userId}
					priorityType="schedule"
					customBorder="border-l border-b border-t-[1px] border-r-[1px] border-t-gray-100 border-r-gray-100"
					dotColor="bg-schedule"
					tasks={filterPriority.schedule}
				/>
				<Matrix
					userId={userId}
					priorityType="delegate"
					customBorder="border-r border-t border-b-[1px] border-l-[1px] border-b-gray-100 border-l-gray-100"
					dotColor="bg-delegate"
					tasks={filterPriority.delegate}
				/>
				<Matrix
					userId={userId}
					priorityType="delete"
					customBorder="border-l border-t border-b-[1px] border-r-[1px] border-b-gray-100 border-r-gray-100"
					dotColor="bg-delete"
					tasks={filterPriority.delete}
				/>
			</div>
			<div className="absolute bottom-0 left-0 hidden w-full max-w-[1000px] origin-top-left -rotate-90 text-center lg:flex">
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
