import DashboardFilters from '@/components/dashboard/DashboardFilters';
import DashboardTable from '@/components/dashboard/DashboardTable';
import Pagination from '@/components/Pagination';
import { dashboardFilters } from '@/constants/filter';
import { getTaskByUser } from '@/lib/actions/task.action';
import { RouteParams } from '@/types/global';
import { create } from 'domain';
import React from 'react';

const page = async ({ searchParams }: RouteParams) => {
	const {
		page,
		pageSize,
		query = '',
		createdAt,
		priorityType,
		priorityStatus,
	} = await searchParams;

	const filters = {
		createdAt: createdAt || undefined,
		priorityType: priorityType || undefined,
		priorityStatus: priorityStatus || undefined,
	};

	const { success, data, error } = await getTaskByUser({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 5,
		query,
		filter: filters,
	});

	console.log(data);

	if (!success) {
		console.error(error?.message);

		return;
	}

	const { isNext } = data || {};
	return (
		<div className="space-y-8 py-32">
			<h1 className="text-dark100_light200">Dashboard</h1>
			<div className="space-y-8">
				<DashboardFilters filters={dashboardFilters} />
				<DashboardTable data={data?.tasks!} />
				<div className="mx-auto mt-8 w-fit">
					<Pagination page={page} isNext={isNext || false} />
				</div>
			</div>
		</div>
	);
};

export default page;
