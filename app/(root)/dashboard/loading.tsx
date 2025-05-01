import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
	return (
		<div className="space-y-8 py-32">
			<h1 className="text-dark100_light200">Dashboard</h1>
			<div className="space-y-8">
				<Skeleton className="h-[130px] w-full rounded-[28px]" />
				<Skeleton className="h-[795.5px] w-full rounded-[28px]" />
				<Skeleton className="h-[1044px] w-full rounded-[28px]" />
				<div className="flex gap-8">
					<Skeleton className="h-[634px] flex-1 rounded-[28px]" />
					<Skeleton className="h-[634px] flex-1 rounded-[28px]" />
				</div>
			</div>
		</div>
	);
};

export default loading;
