import React from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { LoaderCircleIcon, Trash2Icon, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const TaskConfirmDeleteDialog = ({
	isSubmitting,
	handleDeleteTask,
	taskId,
	contents,
}: {
	isSubmitting?: boolean;
	handleDeleteTask: (taskId?: string) => void;
	taskId?: string;
	contents: {
		title: string;
		description: string;
		note: string;
	};
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={cn('delete-btn w-fit self-end')} size="lg">
					<Trash2Icon className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="space-x-4">
					<DialogTitle className="text-center">{contents.title}</DialogTitle>
					<DialogDescription className="text-center">
						{contents.description}
					</DialogDescription>
					<span className="text-danger text-center text-sm">
						{contents.note}
					</span>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="outline"
							className="cancel-btn w-fit self-end"
							size="lg"
						>
							<X /> Cancel
						</Button>
					</DialogClose>
					<Button
						className="delete-btn w-fit self-end"
						size="lg"
						onClick={() => {
							if (taskId) {
								return handleDeleteTask(taskId);
							} else {
								return handleDeleteTask();
							}
						}}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<LoaderCircleIcon className="size-5 animate-spin" />
						) : (
							<>
								<Trash2Icon /> Delete
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TaskConfirmDeleteDialog;
