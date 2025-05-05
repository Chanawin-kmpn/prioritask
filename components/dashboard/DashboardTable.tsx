'use client';
import { deleteTaskFromDashboard } from '@/lib/actions/task.action';
import { Task } from '@/types/global';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
	Table,
	TableBody,
	TableHeader,
	TableRow,
	TableHead,
	TableCell,
} from '../ui/table';
import dayjs from 'dayjs';
import { Badge } from '../ui/badge';
import { taskPriorityBadge, taskStatusBadge } from '@/constants';
import TaskConfirmDeleteDialog from '../TaskConfirmDeleteDialog';

const DashboardTable = ({ data }: { data: Task[] }) => {
	const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
	// ฟังก์ชันนี้จะทำการลบ Task
	const handleDeleteTask = async (taskId: string) => {
		setIsDeleteSubmitting(true);
		const { success, error } = await deleteTaskFromDashboard({
			taskId,
		});

		if (!success) {
			toast.error('Error', {
				description: error?.message,
			});
			return;
		}

		setIsDeleteSubmitting(false);
		toast.success('Task deleted successfully!', {
			description: '🎯 One less thing to worry about—keep moving forward!',
		});
	};

	return (
		<div className="bg-light100_dark800 max-h- overflow-y-auto rounded-[28px] border border-gray-100 p-8">
			<Table>
				<TableHeader className="text-dark100_light200">
					<TableRow>
						<TableHead className="w-3xs">Task Name</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Complete Date</TableHead>
						<TableHead className="centre"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.map((task: Task) => (
						<TableRow key={task.id}>
							<TableCell className="font-medium">{task.name}</TableCell>
							<TableCell>
								<Badge
									className={`rounded-full px-8 text-lg ${taskPriorityBadge[task.priority].className}`}
								>
									{taskPriorityBadge[task.priority].label}
								</Badge>
							</TableCell>
							<TableCell>
								{dayjs(task.createdAt as Date).format('D MMMM YYYY')}
							</TableCell>
							<TableCell className="">
								<Badge
									className={`rounded-full text-lg ${taskStatusBadge[task.status].className}`}
								>
									<span className="text-2xl">•</span>{' '}
									{taskStatusBadge[task.status].label}
								</Badge>
							</TableCell>
							<TableCell className="">
								{task.completedAt
									? dayjs(task.completedAt).format('D MMMM YYYY')
									: '-'}
							</TableCell>
							<TableCell className="centre">
								<TaskConfirmDeleteDialog
									handleDeleteTask={() => handleDeleteTask(task.id)}
									taskId={task.id}
									contents={{
										title:
											'Are you sure you want to delete this task from Dashboard?',
										description:
											'This data will be automatically deleted after 30 days. Do you want to delete it now?',
										note: 'Note: Deleting a task from Dashboard is permanent and cannot be undone',
									}}
									isSubmitting={isDeleteSubmitting}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default DashboardTable;
