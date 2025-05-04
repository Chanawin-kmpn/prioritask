import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
	return (
		<div className="space-y-8 px-4 py-32 sm:px-8">
			<h1 className="text-dark100_light200">Account</h1>
			<div className="space-y-8">
				<Skeleton className="h-[649px] w-full rounded-[28px]" />
				<Skeleton className="h-[182.5px] w-full rounded-[28px]" />
				<Skeleton className="h-[291px] w-full rounded-[28px]" />
			</div>
		</div>
	);
};

export default loading;
