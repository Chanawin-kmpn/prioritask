'use client';
import { formUrlQuery } from '@/lib/url';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface Props {
	page: number | undefined | string;
	isNext: boolean;
	containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses }: Props) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const handleNavigation = (type: 'prev' | 'next') => {
		const nextPageNumber =
			type === 'prev' ? Number(page) - 1 : Number(page) + 1;

		// Update URL
		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: 'page',
			value: nextPageNumber.toString(),
		});

		router.push(newUrl);
	};
	return (
		<div
			className={cn(
				'mt-5 flex w-full items-center justify-center gap-2',
				containerClasses
			)}
		>
			{/* Previous Page Button */}
			{Number(page) > 1 && (
				<Button
					onClick={() => handleNavigation('prev')}
					className="flex min-h-[36px] items-center justify-center gap-2 border border-gray-100 text-lg"
				>
					<p className="body-medium text-dark100_light200">Prev</p>
				</Button>
			)}

			<div className="flex items-center justify-center rounded-md border border-gray-100 px-4 py-2 text-lg">
				<p className="body-semiboldtext-dark100_light200">{page}</p>
			</div>

			{/* Next Page Button */}
			{isNext && (
				<Button
					onClick={() => handleNavigation('next')}
					className="flex min-h-[36px] items-center justify-center gap-2 border border-gray-100 text-lg"
				>
					<p className="body-medium text-dark100_light200">Next</p>
				</Button>
			)}
		</div>
	);
};

export default Pagination;
