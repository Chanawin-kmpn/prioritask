import DashboardTable from '@/components/dashboard/DashboardTable';
import Pagination from '@/components/Pagination';
import { getTaskByUser } from '@/lib/actions/task.action';
import { RouteParams } from '@/types/global';
import React from 'react';

const page = async ({ searchParams }: RouteParams) => {
	const { page, pageSize, query, filter } = await searchParams;
	console.log(page);

	const { success, data, error } = await getTaskByUser({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 5,
		query: query || '',
		filter: filter || '',
	});

	if (!success) {
		console.error(error?.message);

		return;
	}

	const { isNext } = data || {};
	return (
		<div className="space-y-8 py-32">
			<h1 className="text-dark100_light200">Dashboard</h1>
			<div className="space-y-8">
				<DashboardTable data={data?.tasks!} />
				<div className="mx-auto mt-8 w-fit">
					<Pagination page={page} isNext={isNext || false} />
				</div>
			</div>
		</div>
	);
};

export default page;
