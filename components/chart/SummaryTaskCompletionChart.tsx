'use client';
import { getCurrentMonth } from '@/lib/utils';
import { ChartDataCompletion } from '@/types/global';
import React, { useMemo } from 'react';
import { RadialBarChart, PolarRadiusAxis, Label, RadialBar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { chartDataCompletionConfig } from '@/constants/chartConfig';
import EmptyData from '../EmptyData';

const SummaryTaskCompletionChart = ({
	chartDataCompletion,
}: {
	chartDataCompletion: ChartDataCompletion[];
}) => {
	const totalCompletion = useMemo(() => {
		return {
			complete: chartDataCompletion.reduce(
				(acc, item) => acc + item.complete,
				0
			),
			incomplete: chartDataCompletion.reduce(
				(acc, item) => acc + item.incomplete,
				0
			),
		};
	}, [chartDataCompletion]);
	const totalTasks = totalCompletion.complete + totalCompletion.incomplete;
	const completionRate =
		totalTasks > 0 ? (totalCompletion.complete / totalTasks) * 100 : 0;

	const data = [
		{
			complete: totalCompletion.complete,
			incomplete: totalCompletion.incomplete,
		},
	];
	const currentMonth = getCurrentMonth();

	return (
		<div className="bg-light100_dark800 flex flex-1 flex-col items-center justify-center gap-8 rounded-[28px] border border-gray-100 p-8">
			{totalCompletion.complete === 0 ? (
				<EmptyData emptyType="complete" />
			) : (
				<>
					<div className="space-y-2 text-center">
						<p className="text-3xl font-bold">Total task completion rate</p>
						<p className="text-xl font-bold">{currentMonth}</p>
					</div>
					<div className="size-full">
						<ChartContainer
							config={chartDataCompletionConfig}
							className="mx-auto aspect-square w-full max-w-[250px]"
						>
							<RadialBarChart
								data={data}
								endAngle={180}
								innerRadius={80}
								outerRadius={180}
							>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
									<Label
										content={({ viewBox }) => {
											if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
												return (
													<text
														x={viewBox.cx}
														y={viewBox.cy}
														textAnchor="middle"
													>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) - 16}
															className="fill-foreground text-2xl font-bold"
														>
															{totalCompletion.complete.toLocaleString()}{' '}
															{/* จำนวนที่เสร็จสมบูรณ์ */}
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 4}
															className="fill-muted-foreground"
														>
															Complete
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 24}
															className="fill-muted-foreground"
														>
															{completionRate.toFixed(2)}%{' '}
															{/* อัตราความสำเร็จ */}
														</tspan>
													</text>
												);
											}
										}}
									/>
								</PolarRadiusAxis>
								<RadialBar
									dataKey="incomplete"
									name="Incomplete"
									fill={chartDataCompletionConfig.incomplete.color}
									stackId="a"
									cornerRadius={4}
									strokeWidth={5}
									className="stroke-transparent stroke-2"
								/>
								<RadialBar
									dataKey="complete"
									name="Complete"
									stackId="a"
									cornerRadius={4}
									strokeWidth={5}
									fill={chartDataCompletionConfig.complete.color}
									className="stroke-transparent stroke-2"
								/>
							</RadialBarChart>
						</ChartContainer>
					</div>
					<div>
						<div className="flex gap-4">
							{Object.entries(chartDataCompletionConfig).map(([key, value]) => (
								<div key={key} className="flex items-center gap-2">
									<div
										className={`size-4 rounded-[4px] ${value.label === 'Complete' ? 'bg-safe' : 'bg-danger'}`}
									></div>
									<p>{chartDataCompletionConfig[key].label}</p>
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="flex items-center gap-2">
							<p className="text-2xl">Total task completed this month:</p>
							<span className="text-3xl">{totalCompletion.complete}</span>
						</div>
						<p>You're halfway to completing your tasks! Keep going! 🚀</p>
					</div>
				</>
			)}
		</div>
	);
};

export default SummaryTaskCompletionChart;
