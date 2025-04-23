import React from 'react';
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
import { Task } from '@/types/global';
import dayjs from 'dayjs';
import {
	CheckIcon,
	CircleHelpIcon,
	PencilIcon,
	Trash2Icon,
} from 'lucide-react';
import PriorityInfo from '../PriorityInfo';
import { Button } from '../ui/button';
import { setTaskToComplete } from '@/lib/actions/task.action';
import { toast } from 'sonner';

interface TaskCardProps {
	dotColor: string;
	task: Task;
	userId: string;
}

const TaskCard = ({ dotColor, task, userId }: TaskCardProps) => {
	const handleCompleteTask = async () => {
		if (!task.id) {
			console.error('Task ID is undefined');
			return;
		}

		if (userId) {
			const { success, error } = await setTaskToComplete({
				taskId: task.id,
				userId,
			});

			if (!success) {
				toast.error('Error', {
					description: error?.message,
				});
			}
		} else {
			updateLocalStorage(task.id, 'complete');
			window.location.reload();
		}
		toast.success('Task marked as complete. You are not logged in.', {
			description: `Task "${task.name}" has been successfully completed.`,
		});
	};

	const updateLocalStorage = (taskId: string, newStatus: string) => {
		const tasks = JSON.parse(localStorage.getItem('guestTasks')!) || [];
		const updatedTasks = tasks.map((task: Task) => {
			if (task.id === taskId) {
				return {
					...task,
					status: newStatus, // Update the status
				};
			}
			return task;
		});
		localStorage.setItem('guestTasks', JSON.stringify(updatedTasks));
	};

	return (
		<HoverCard openDelay={300}>
			<HoverCardTrigger>
				<div className={`size-12 rounded-full ${dotColor} border`} />
			</HoverCardTrigger>
			<HoverCardContent className="w-[32rem]">
				<Card>
					<CardHeader>
						<CardTitle className="pointer-events-none text-3xl tracking-[8px] uppercase">
							Task Detail
						</CardTitle>
						<CardDescription>
							Task information and management options
						</CardDescription>
					</CardHeader>
					<div className="divider" />
					<CardContent>
						<p className="text-2xl">{task.name}</p>
						<p className="text-xl">
							{task.description ? task.description : '-'}
						</p>
					</CardContent>
					<div className="divider" />
					<CardContent>
						<div className="flex items-center gap-2">
							<p className="text-lg font-bold">Due Date:</p>
							<span className="uppercase">
								{dayjs(task.dueDate).format('D MMMM YYYY')}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-lg font-bold">Due Time:</p>
							<span className="uppercase">
								{task.dueTime ? task.dueTime : '-'}
							</span>
						</div>
					</CardContent>
					<div className="divider" />
					<CardContent className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<p className="text-lg font-bold">Priority:</p>
							<span className="uppercase">{task.priority}</span>
						</div>
						<div>
							<PriorityInfo />
						</div>
					</CardContent>
					<div className="divider" />
					<CardFooter className="justify-between">
						<Button
							size="lg"
							className="submit-btn bg-safe hover:bg-safe/80 w-fit self-end"
							onClick={handleCompleteTask}
						>
							<CheckIcon />
							Complete
						</Button>
						<div className="space-x-4">
							<Button
								className="submit-btn bg-danger hover:bg-danger/80 w-fit self-end"
								size="lg"
							>
								<Trash2Icon />
							</Button>
							<Button size="lg" className="submit-btn w-fit">
								<PencilIcon /> Edit
							</Button>
						</div>
					</CardFooter>
				</Card>
			</HoverCardContent>
		</HoverCard>
	);
};

export default TaskCard;
