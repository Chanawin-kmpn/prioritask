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

const TaskConfirmDeleteDialog = ({
	isSubmitting,
	handleDeleteTask,
}: {
	isSubmitting: boolean;
	handleDeleteTask: () => void;
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="delete-btn w-fit self-end" size="lg">
					<Trash2Icon className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="space-x-4">
					<DialogTitle className="text-center">
						Are you sure to delete this task?
					</DialogTitle>
					<DialogDescription className="text-center">
						No matter how overwhelming your workload may feel, stay strong!💪
						Keep tackling each challenge step by step, and you’ll reach your
						goals in no time!🎯
					</DialogDescription>
					<span className="text-danger text-center text-sm">
						Note: Once you delete this task, it will be permanently removed.
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
						onClick={handleDeleteTask}
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
