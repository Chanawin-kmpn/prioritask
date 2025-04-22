import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
	return (
		<div className="relative p-14">
			<div className="absolute top-0 flex w-full max-w-[1000px] text-center">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Urgent
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Urgent
				</span>
			</div>
			<div className="grid w-fit grid-cols-2 justify-center gap-[2px]">
				<Skeleton className="size-[501.82px] rounded-none" />
				<Skeleton className="size-[501.82px] rounded-none" />
				<Skeleton className="size-[501.82px] rounded-none" />
				<Skeleton className="size-[501.82px] rounded-none" />
			</div>
			<div className="absolute bottom-0 left-0 flex w-full max-w-[1000px] origin-top-left -rotate-90 text-center">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Important
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Important
				</span>
			</div>
		</div>
	);
};

export default Loading;
