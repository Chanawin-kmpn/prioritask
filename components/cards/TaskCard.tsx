'use client';
import React, { useState } from 'react';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '../ui/hover-card';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Task, TaskPriority } from '@/types/global';
import dayjs from 'dayjs';
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import PriorityInfo from '../PriorityInfo';
import { Button } from '../ui/button';
import {
	deleteTaskByTaskId,
	setTaskToComplete,
} from '@/lib/actions/task.action';
import { toast } from 'sonner';
import TaskConfirmDeleteDialog from '../TaskConfirmDeleteDialog';
import { deleteTaskFromLocalStorage } from '@/lib/utils';
import TaskForm from '../forms/TaskForm';
import { title } from 'process';
import TaskContentCard from './TaskContentCard';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface TaskCardProps {
	priorityType: TaskPriority;
	dotColor: string;
	task: Task;
	userId: string;
	setTasks: (prevTask: any) => void;
}

const TaskCard = ({
	priorityType,
	dotColor,
	task,
	userId,
	setTasks,
}: TaskCardProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleCompleteTask = async () => {
		setIsSubmitting(true);
		if (!task.id) {
			console.error('Task ID is undefined');
			return;
		}

		if (task.status === 'complete') {
			toast.error('Error', {
				description: 'Task is already marked as complete!',
			});
			return;
		}

		if (userId) {
			const { success, error } = await setTaskToComplete({
				taskId: task.id,
				userId,
			});

			setIsSubmitting(false);

			if (!success) {
				toast.error('Error', {
					description: error?.message,
				});
				return;
			}
		} else {
			deleteTaskFromLocalStorage(task.id);
			window.location.reload();
		}
		toast.success('Task marked as complete.', {
			description: `Task "${task.name}" has been successfully completed.`,
		});
	};

	const handleDeleteTask = async () => {
		setIsSubmitting(true);
		if (!task.id) {
			console.error('Task ID is undefined');
			return;
		}
		if (userId) {
			const { success, error } = await deleteTaskByTaskId({
				taskId: task.id,
				userId,
			});

			setIsSubmitting(false);

			if (!success) {
				toast.error('Error', {
					description: error?.message,
				});
			}
		} else {
			deleteTaskFromLocalStorage(task.id);
			window.location.reload();
		}
		toast.success('Task deleted successfully!', {
			description: '🎯 One less thing to worry about—keep moving forward!',
		});
	};

	return (
		<>
			<HoverCard openDelay={300}>
				<HoverCardTrigger asChild className="hidden lg:block">
					<div
						className={`size-10 rounded-full md:size-12 ${dotColor} border`}
					/>
				</HoverCardTrigger>
				<HoverCardContent className="w-[32rem]">
					<TaskContentCard
						task={task}
						handleCompleteTask={handleCompleteTask}
						handleDeleteTask={handleDeleteTask}
						isSubmitting={isSubmitting}
						priorityType={priorityType}
						setTasks={setTasks}
					/>
				</HoverCardContent>
			</HoverCard>
			<Popover>
				<PopoverTrigger className="lg:hidden">
					<div
						className={`size-10 rounded-full md:size-12 ${dotColor} border`}
					/>
				</PopoverTrigger>
				<PopoverContent className="w-[22rem] max-w-[32rem]" align="start">
					<TaskContentCard
						task={task}
						handleCompleteTask={handleCompleteTask}
						handleDeleteTask={handleDeleteTask}
						isSubmitting={isSubmitting}
						priorityType={priorityType}
						setTasks={setTasks}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default TaskCard;
