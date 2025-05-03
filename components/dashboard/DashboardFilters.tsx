'use client';
import React, { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFormUrlQuery } from '@/lib/url';
import { Button } from '../ui/button';

interface Filter {
	name: string;
	value: string;
}

interface Props {
	filters: Record<string, Filter[]>;
}

const DashboardFilters = ({ filters }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const createAtValue = searchParams.get('createdAt');
	const priorityTypeValue = searchParams.get('priorityType');
	const priorityStatusValue = searchParams.get('priorityStatus');

	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string>
	>({});

	// ตั้งค่าเริ่มต้นจาก searchParams
	useEffect(() => {
		setSelectedFilters({
			createdAt: createAtValue || '',
			priorityType: priorityTypeValue || '',
			priorityStatus: priorityStatusValue || '',
		});
	}, [createAtValue, priorityTypeValue, priorityStatusValue]);

	const handleUpdateParmas = (key: string, value: string) => {
		setSelectedFilters((prev) => ({ ...prev, [key]: value }));

		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key,
			value,
			isResetPage: true,
		});

		router.push(newUrl, { scroll: false });
	};

	const handleClearFilters = () => {
		setSelectedFilters({});
		const newUrl = removeKeysFormUrlQuery({
			params: searchParams.toString(),
			keysToRemove: ['createdAt', 'priorityType', 'priorityStatus'],
		});
		router.push(newUrl, { scroll: false });
	};

	return (
		<div className="bg-light100_dark800 max-h- flex items-center gap-16 overflow-y-auto rounded-[28px] border border-gray-100 p-8">
			<div className="flex w-full flex-col gap-8 lg:flex-row">
				<p className="text-dark100_light200 text-2xl font-bold">Filter by:</p>
				<div className="flex w-full flex-1 flex-col gap-8 lg:flex-row lg:items-center">
					{Object.entries(filters).map(([key, value]) => (
						<div key={key} className="w-full">
							<p className="text-lg font-bold">
								{key === 'createdAt'
									? 'Created at'
									: key === 'priorityType'
										? 'Priority type'
										: 'Task status'}
							</p>
							<Select
								value={selectedFilters[key] || ''}
								onValueChange={(value) => handleUpdateParmas(key, value)}
							>
								<SelectTrigger className="w-full lg:w-[180px]">
									<SelectValue placeholder="Select a filter" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{value.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					))}
				</div>
				<Button
					onClick={handleClearFilters}
					className="text-dark100_light200"
					variant="link"
				>
					Clear filters
				</Button>
			</div>
		</div>
	);
};

export default DashboardFilters;
