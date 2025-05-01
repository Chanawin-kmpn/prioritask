import { ChartDataCompletion, ChartDataPriority, Task } from '@/types/global';
import React from 'react';
import TabbarCharts from '../chart/TabbarCharts';
import { chartDataGenerater } from '@/lib/utils';
import { getAllTasksByUser } from '@/lib/actions/task.action';
import SummaryTaskChart from '../chart/SummaryTaskChart';
import SummaryTaskCompletionChart from '../chart/SummaryTaskCompletionChart';

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
		<>
			<div className="bg-light100_dark800 max-h- flex flex-col gap-8 overflow-y-auto rounded-[28px] border border-gray-100">
				<div>
					<TabbarCharts
						chartDataCompletion={chartDataCompletion}
						chartDataPriority={chartDataPriority}
					/>
				</div>
			</div>
			<div className="flex gap-8 pt-0">
				<SummaryTaskChart chartDataPriority={chartDataPriority} />
				<SummaryTaskCompletionChart chartDataCompletion={chartDataCompletion} />
			</div>
		</>
	);
};

export default DashboardChart;
