import { getTaskByUser } from '@/lib/actions/task.action';
import { Task } from '@/types/global';
import React from 'react';
import { toast } from 'sonner';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import dayjs from 'dayjs';
import { Trash2Icon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { taskStatusBadge } from '@/constants';

const DashboardTable = async () => {
	const { success, data, error } = await getTaskByUser();

	if (!success) {
		console.error(error?.message);

		return;
	}

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
							<TableCell className="uppercase">{task.priority}</TableCell>
							<TableCell></TableCell>
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
								<Trash2Icon className="size-6" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default DashboardTable;
