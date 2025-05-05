import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
	return (
		<div className="bg-light200_dark100 flex h-full justify-center py-32">
			<div className="relative size-full p-4 lg:w-fit lg:p-14">
				<div className="absolute top-0 hidden w-full max-w-[1000px] text-center lg:flex">
					<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
						Urgent
					</span>
					<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
						Not Urgent
					</span>
				</div>
				<div className="grid w-full grid-cols-1 justify-center gap-8 lg:grid lg:w-fit lg:grid-cols-2 lg:gap-0">
					<Skeleton className="min-h-[430px] min-w-[328px] rounded-[28px] sm:h-[688px] sm:max-w-none sm:p-8 md:h-[816px] md:p-16 lg:size-[501.82px] lg:space-y-0 lg:rounded-none lg:p-0" />
					<Skeleton className="min-h-[430px] min-w-[328px] rounded-[28px] sm:h-[688px] sm:max-w-none sm:p-8 md:h-[816px] md:p-16 lg:size-[501.82px] lg:space-y-0 lg:rounded-none lg:p-0" />
					<Skeleton className="min-h-[430px] min-w-[328px] rounded-[28px] sm:h-[688px] sm:max-w-none sm:p-8 md:h-[816px] md:p-16 lg:size-[501.82px] lg:space-y-0 lg:rounded-none lg:p-0" />
					<Skeleton className="min-h-[430px] min-w-[328px] rounded-[28px] sm:h-[688px] sm:max-w-none sm:p-8 md:h-[816px] md:p-16 lg:size-[501.82px] lg:space-y-0 lg:rounded-none lg:p-0" />
				</div>
				<div className="absolute bottom-0 left-0 hidden w-full max-w-[1000px] origin-top-left -rotate-90 text-center lg:flex">
					<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
						Not Important
					</span>
					<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
						Important
					</span>
				</div>
			</div>
		</div>
	);
};

export default Loading;
