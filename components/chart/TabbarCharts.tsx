'use client';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { ChartDataCompletion, ChartDataPriority } from '@/types/global';
import {
	chartDataCompletionConfig,
	chartDataPriorityConfig,
} from '@/constants/chartConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';

interface Props {
	chartDataCompletion: ChartDataCompletion[];
	chartDataPriority: ChartDataPriority[];
}
const TabbarCharts = ({ chartDataCompletion, chartDataPriority }: Props) => {
	const [activeTab, setActiveTab] = useState('priority');
	const getTitleAndDescription = () => {
		if (activeTab === 'priority') {
			return {
				title: 'Tasks by Priority Completed Daily',
				description:
					'Showing total tasks finished each day by priority type (Hover over bars for more details)',
			};
		} else {
			return {
				title: 'Completion Rate',
				description:
					'Overall completion rate of tasks this month (Hover over bars for more details)',
			};
		}
	};

	const { title, description } = getTitleAndDescription();
	return (
		<Tabs
			defaultValue="priority"
			onValueChange={setActiveTab}
			className="w-full"
		>
			<Card className="p-0">
				<div className="bg-light100_dark800 flex flex-col border-b border-gray-100 lg:flex-row">
					<div className="flex-2 p-8 lg:border-r">
						<CardTitle className="text-3xl">{title}</CardTitle>
						<CardDescription className="text-xl">{description}</CardDescription>
					</div>
					<div className="h-full flex-1 self-center p-4 lg:p-8">
						<TabsList className="h-full w-full flex-col items-center lg:flex-row">
							<TabsTrigger
								className="w-full cursor-pointer text-3xl"
								value="priority"
							>
								Priority type
							</TabsTrigger>
							<TabsTrigger
								className="w-full cursor-pointer text-3xl"
								value="completion"
							>
								Completion rate
							</TabsTrigger>
						</TabsList>
					</div>
				</div>
				<CardContent className="p-2 py-4 sm:p-4 lg:p-8">
					<TabsContent value="priority">
						<ChartContainer
							config={chartDataPriorityConfig}
							className="min-h-[200px] w-full"
						>
							<BarChart accessibilityLayer data={chartDataPriority}>
								<CartesianGrid vertical={false} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<XAxis
									dataKey="date"
									tickLine={false}
									tickMargin={16}
									axisLine={true}
									tickFormatter={(value) => value.split(',')[0]}
								/>

								<Bar
									dataKey="delete"
									fill={chartDataPriorityConfig.delete.color}
									stackId="a"
								/>
								<Bar
									dataKey="delegate"
									fill={chartDataPriorityConfig.delegate.color}
									stackId="a"
								/>
								<Bar
									dataKey="schedule"
									fill={chartDataPriorityConfig.schedule.color}
									stackId="a"
								/>
								<Bar
									dataKey="do"
									fill={chartDataPriorityConfig.do.color}
									stackId="a"
								/>
							</BarChart>
						</ChartContainer>
					</TabsContent>
					<TabsContent value="completion">
						<ChartContainer
							config={chartDataCompletionConfig}
							className="min-h-[200px] w-full"
						>
							<BarChart accessibilityLayer data={chartDataCompletion}>
								<CartesianGrid vertical={false} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<XAxis
									dataKey="date"
									tickLine={false}
									tickMargin={16}
									axisLine={true}
									tickFormatter={(value) => value.split(',')[0]}
								/>
								<Bar
									dataKey="complete"
									fill={chartDataCompletionConfig.complete.color}
									stackId="b"
								/>
								<Bar
									dataKey="incomplete"
									fill={chartDataCompletionConfig.incomplete.color}
									stackId="b"
								/>
							</BarChart>
						</ChartContainer>
					</TabsContent>
				</CardContent>
			</Card>
		</Tabs>
	);
};

export default TabbarCharts;
