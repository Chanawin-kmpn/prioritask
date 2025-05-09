import React from 'react';
import {
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import ROUTES from '@/constants/routes';
import { LIMIT_GUEST_TASK } from '@/constants/constants';

const TaskLimitAlertDialog = ({
	open,
	setOpen,
	priorityType,
	taskCount,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
	priorityType: string;
	taskCount: number;
}) => {
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent className="gap-8">
				<AlertDialogHeader>
					<AlertDialogTitle>✋ Trial Limit Reached!</AlertDialogTitle>
					<AlertDialogDescription className="text-lg">
						Sign in now to use all Prioritask features for{' '}
						<span className="text-safe">FREE.</span>
					</AlertDialogDescription>
					<AlertDialogDescription className="text-base">
						Each quadrant in the trial version allows only 5 tasks:
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="mx-auto flex w-fit flex-col items-center gap-2">
					<span className="text-5xl uppercase">{priorityType}</span>
					<div className="h-[1px] w-full bg-gray-100" />
					<span className="text-xl">
						{taskCount} / {LIMIT_GUEST_TASK}
					</span>
				</div>
				<AlertDialogDescription>
					After logging in, all tasks will reset. Tasks created before logging
					in will be stored in your browser and visible again after logout.
					After 1 week, these tasks will be automatically deleted.
				</AlertDialogDescription>
				<AlertDialogDescription className="text-sm text-red-500">
					<strong>Note:</strong> Only tasks created while logged out will be
					deleted automatically after 1 week, not those created after logging
					in.
				</AlertDialogDescription>
				<AlertDialogFooter className="flex">
					<Button
						variant="outline"
						className="cancel-btn w-fit py-4"
						size="lg"
						onClick={() => setOpen(false)}
					>
						<X /> Cancel
					</Button>

					<AlertDialogAction asChild>
						<Button className="submit-btn flex-2" size="lg" asChild>
							<Link href={ROUTES.SIGN_IN}>Sign in</Link>
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default TaskLimitAlertDialog;
