import { ChartDataCompletion, ChartDataPriority, Task } from '@/types/global';
import React from 'react';
import TabbarCharts from '../chart/TabbarCharts';
import { chartDataGenerater } from '@/lib/utils';
import { getAllTasksByUser } from '@/lib/actions/task.action';

const DashboardChart = async () => {
	const { success, data, error } = await getAllTasksByUser();

	if (!success) {
		console.error(error?.message);
		return;
	}

	const tasks = data || [];
	const chartDataCompletion = chartDataGenerater(
		tasks,
		'completion'
	) as ChartDataCompletion[]; // สร้าง chart data สำหรับ Completion
	const chartDataPriority = chartDataGenerater(
		tasks,
		'priority'
	) as ChartDataPriority[];

	return (
		<div className="bg-light100_dark800 max-h- flex items-center gap-16 overflow-y-auto rounded-[28px] border border-gray-100">
			<TabbarCharts
				chartDataCompletion={chartDataCompletion}
				chartDataPriority={chartDataPriority}
			/>
		</div>
	);
};

export default DashboardChart;
