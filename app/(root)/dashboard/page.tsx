import DashboardChart from '@/components/dashboard/DashboardChart';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import DashboardTable from '@/components/dashboard/DashboardTable';
import Pagination from '@/components/Pagination';
import { dashboardFilters } from '@/constants/filter';
import { getTaskByFilters } from '@/lib/actions/task.action';
import { RouteParams } from '@/types/global';
import React, { Suspense } from 'react';
import Loading from '../dashboard/loading';
import EmptyData from '@/components/EmptyData';

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

	const { success, data, error } = await getTaskByFilters({
		page: Number(page) || 1,
		pageSize: Number(pageSize) || 10,
		query,
		filter: filters,
	});

	if (!success) {
		console.error(error?.message);

		return;
	}

	const { isNext } = data || {};
	return (
		<Suspense fallback={<Loading />}>
			<div className="space-y-8 px-4 py-32 sm:px-8">
				<h1 className="text-dark100_light200">Dashboard</h1>
				<div className="space-y-8">
					<DashboardFilters filters={dashboardFilters} />
					{data?.tasks?.length === 0 ? (
						<EmptyData emptyType="task" />
					) : (
						<>
							<DashboardTable data={data?.tasks!} />
							<div className="mx-auto mt-8 w-fit">
								<Pagination page={page} isNext={isNext || false} />
							</div>
							<DashboardChart />
						</>
					)}
				</div>
			</div>
		</Suspense>
	);
};

export default page;
