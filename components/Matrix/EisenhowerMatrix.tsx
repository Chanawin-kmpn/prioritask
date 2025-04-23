import React from 'react';
import { getTaskByUser } from '@/lib/actions/task.action';
import { Task } from '@/types/global';
import Matrix from './Matrix';
import { toast } from 'sonner';

interface FilterPriority {
	do: Task[];
	schedule: Task[];
	delegate: Task[];
	delete: Task[];
}

const EisenhowerMatrix = async ({ userId }: { userId: string }) => {
	const { success, data, error } = await getTaskByUser();

	if (!success) {
		return null;
	}

	const filterPriority: FilterPriority = {
		do: data!.filter((task) => task.priority === 'do'),
		schedule: data!.filter((task) => task.priority === 'schedule'),
		delegate: data!.filter((task) => task.priority === 'delegate'),
		delete: data!.filter((task) => task.priority === 'delete'),
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
