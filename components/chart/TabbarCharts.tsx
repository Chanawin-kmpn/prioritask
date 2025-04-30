'use client';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '../ui/chart';
import { ChartDataCompletion, ChartDataPriority } from '@/types/global';
import {
	chartDataCompletionConfig,
	chartDataPriorityConfig,
} from '@/constants/chartConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';

interface Props {
	chartDataCompletion: ChartDataCompletion[];
	chartDataPriority: ChartDataPriority[];
}
const TabbarCharts = ({ chartDataCompletion, chartDataPriority }: Props) => {
	const [activeTab, setActiveTab] = useState('priority');
	const getTitleAndDescription = () => {
		if (activeTab === 'priority') {
			return {
				title: 'Priority',
				description: 'This shows tasks categorized by priority type.',
			};
		} else {
			return {
				title: 'Completion',
				description: 'This shows the completion rate of tasks.',
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
			<Card>
				<CardHeader>
					<div>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
					<TabsList>
						<TabsTrigger value="priority">Priority type</TabsTrigger>
						<TabsTrigger value="completion">Completion rate</TabsTrigger>
					</TabsList>
				</CardHeader>
				<CardContent>
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
									tickFormatter={(value) => value.slice(0, 2)}
								/>

								<Bar
									dataKey="delete"
									stackId="a"
									fill={chartDataPriorityConfig.delete.color}
								/>
								<Bar
									dataKey="delegate"
									stackId="a"
									fill={chartDataPriorityConfig.delegate.color}
								/>
								<Bar
									dataKey="schedule"
									stackId="a"
									fill={chartDataPriorityConfig.schedule.color}
								/>
								<Bar
									dataKey="do"
									stackId="a"
									fill={chartDataPriorityConfig.do.color}
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
									tickFormatter={(value) => value.slice(0, 2)}
								/>
								<Bar
									dataKey="complete"
									fill={chartDataCompletionConfig.complete.color}
									radius={4}
									stackId="a"
								/>
								<Bar
									dataKey="incomplete"
									fill={chartDataCompletionConfig.incomplete.color}
									radius={4}
									stackId="a"
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
