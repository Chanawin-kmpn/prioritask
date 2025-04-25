import DashboardTable from '@/components/dashboard/DashboardTable';
import React from 'react';

const page = () => {
	return (
		<div className="space-y-8 py-32">
			<h1 className="text-dark100_light200">Dashboard</h1>
			<div className="space-y-8">
				<DashboardTable />
			</div>
		</div>
	);
};

export default page;
