'use client';
import React, { useState } from 'react';
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
import { undefined } from 'zod';

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
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string>
	>({});
	const handleUpdateParmas = (key: string, value: string) => {
		setSelectedFilters({ [key]: value });

		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key,
			value,
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
			<p className="text-dark100_light200 text-2xl font-bold">Filter by:</p>
			<div className="flex flex-1 items-center gap-8">
				{Object.entries(filters).map(([Key, value]) => (
					<div key={Key}>
						<p className="text-lg font-bold">
							{Key === 'createdAt'
								? 'Created at'
								: Key === 'priorityType'
									? 'Priority type'
									: 'Task status'}
						</p>
						<Select
							defaultValue={selectedFilters[Key]}
							onValueChange={(value) => handleUpdateParmas(Key, value)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select a filters" />
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
				Clear a filters
			</Button>
		</div>
	);
};

export default DashboardFilters;
