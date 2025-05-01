'use client';
import { chartDataPriorityConfig } from '@/constants/chartConfig';
import { ChartDataPriority } from '@/types/global';
import React, { useMemo, useState } from 'react';

import { Pie, Sector, Label, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { getCurrentMonth } from '@/lib/utils';

const SummaryTaskChart = ({
	chartDataPriority,
}: {
	chartDataPriority: ChartDataPriority[];
}) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const totalTasks = useMemo(() => {
		return {
			do: chartDataPriority.reduce((acc, item) => acc + item.do, 0),
			schedule: chartDataPriority.reduce((acc, item) => acc + item.schedule, 0),
			delegate: chartDataPriority.reduce((acc, item) => acc + item.delegate, 0),
			delete: chartDataPriority.reduce((acc, item) => acc + item.delete, 0),
		};
	}, [chartDataPriority]);

	const totalTaskCount = useMemo(() => {
		return (totalTasks.delegate +
			totalTasks.do +
			totalTasks.schedule +
			totalTasks.delete) as number;
	}, []);

	const data = [
		{
			name: 'Do',
			value: totalTasks.do,
			fill: chartDataPriorityConfig.do.color,
		},
		{
			name: 'Schedule',
			value: totalTasks.schedule,
			fill: chartDataPriorityConfig.schedule.color,
		},
		{
			name: 'Delegate',
			value: totalTasks.delegate,
			fill: chartDataPriorityConfig.delegate.color,
		},
		{
			name: 'Delete',
			value: totalTasks.delete,
			fill: chartDataPriorityConfig.delete.color,
		},
	];

	const currentMonth = getCurrentMonth();

	return (
		<div className="bg-light100_dark800 flex flex-1 flex-col items-center justify-center gap-8 rounded-[28px] border border-gray-100 p-8">
			<div className="space-y-2 text-center">
				<p className="text-3xl font-bold">Total task created</p>
				<p className="text-xl font-bold">{currentMonth}</p>
			</div>
			<div className="size-full">
				<ChartContainer
					config={chartDataPriorityConfig}
					className="mx-auto aspect-square w-full max-w-[300px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							innerRadius={60}
							strokeWidth={5}
							onMouseEnter={(data, index) => {
								setActiveIndex(index);
							}}
							activeIndex={activeIndex}
							activeShape={({ outerRadius = 0, ...props }) => (
								<g>
									<Sector {...props} outerRadius={outerRadius + 10} />
									<Sector
										{...props}
										outerRadius={outerRadius + 25}
										innerRadius={outerRadius + 12}
									/>
								</g>
							)}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{data[activeIndex]?.value.toLocaleString() || 0}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													{data[activeIndex]?.name || 'Unknown'}
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</div>

			<div>
				<div className="flex gap-4">
					{data.map((item, index) => (
						<div key={index}>
							<div className="flex items-center gap-2">
								<div
									className={`h-4 w-4 rounded-[4px] bg-${item.name.toLowerCase()}`}
								></div>
								<p className="text-lg font-semibold">{item.name}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-2 text-center">
				<div className="flex items-center gap-2">
					<p className="text-2xl">Total task created this month:</p>
					<span className="text-3xl">{totalTaskCount}</span>
				</div>
				<p>Explore tasks for better management! 🔥🔥</p>
			</div>
		</div>
	);
};

export default SummaryTaskChart;
