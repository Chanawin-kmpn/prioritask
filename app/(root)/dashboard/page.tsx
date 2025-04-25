import DashboardTable from '@/components/dashboard/DashboardTable';
import { getTaskByUser } from '@/lib/actions/task.action';
import React from 'react';

const page = async () => {
	const { success, data, error } = await getTaskByUser();

	if (!success) {
		console.error(error?.message);

		return;
	}
	return (
		<div className="space-y-8 py-32">
			<h1 className="text-dark100_light200">Dashboard</h1>
			<div className="space-y-8">
				<DashboardTable data={data!} />
			</div>
		</div>
	);
};

export default page;
