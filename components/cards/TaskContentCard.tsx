import dayjs from 'dayjs';
import { LoaderCircleIcon, CheckIcon } from 'lucide-react';
import React from 'react';
import TaskForm from '../forms/TaskForm';
import PriorityInfo from '../PriorityInfo';
import TaskConfirmDeleteDialog from '../TaskConfirmDeleteDialog';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import { Task, TaskPriority } from '@/types/global';

interface Props {
	task: Task;
	handleCompleteTask: () => Promise<void>;
	submitStatus: Record<string, boolean>;
	handleDeleteTask: () => Promise<void>;
	priorityType: TaskPriority;
	setTasks: (prevTask: any) => void;
}

const TaskContentCard = ({
	task,
	handleCompleteTask,
	submitStatus,
	handleDeleteTask,
	priorityType,
	setTasks,
}: Props) => {
	return (
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
				<p className="text-xl">{task.description ? task.description : '-'}</p>
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
					<span className="uppercase">{task.dueTime ? task.dueTime : '-'}</span>
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
			<CardFooter className="items-center justify-between px-0">
				<Button
					size="lg"
					className="complete-btn w-fit self-end"
					onClick={handleCompleteTask}
					disabled={submitStatus.complete}
				>
					{submitStatus.complete ? (
						<LoaderCircleIcon className="animate-spin" />
					) : (
						<>
							<CheckIcon />
							Complete
						</>
					)}
				</Button>
				<div className="flex items-center justify-center gap-4">
					<TaskConfirmDeleteDialog
						handleDeleteTask={handleDeleteTask}
						isSubmitting={submitStatus.delete}
						contents={{
							title: 'Are you sure to delete this task?',
							description: `No matter how overwhelming your workload may feel, stay strong!💪
        Keep tackling each challenge step by step, and you’ll reach your
        goals in no time!🎯`,
							note: 'Note: Once you delete this task, it will be permanently removed.',
						}}
					/>
					<TaskForm
						isEdit={true}
						priorityType={priorityType}
						task={task}
						setTasks={setTasks}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

export default TaskContentCard;
