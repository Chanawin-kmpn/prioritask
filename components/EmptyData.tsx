import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { EMPTY_COMPLETE_TASK, EMPTY_TASK } from '@/constants/states';

interface StateSkeletonProps {
	image: {
		light: string;
		dark: string;
		alt: string;
	};
	title: string;
	message: string;
	button?: {
		text: string;
		href: string;
	};
}

const StateSkeleton = ({
	image,
	title,
	message,
	button,
}: StateSkeletonProps) => (
	<div className="flex w-full flex-col items-center justify-center">
		<>
			<Image
				src={image.dark}
				alt={image.alt}
				width={270}
				height={200}
				className="hidden object-contain dark:block"
			/>
			<Image
				src={image.light}
				alt={image.alt}
				width={270}
				height={200}
				className="block object-contain dark:hidden"
			/>
		</>

		<h2 className="h2-bold text-dark200_light900">{title}</h2>
		<p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
			{message}
		</p>
		{button && (
			<Link href={button.href}>
				<Button className="submit-btn mt-5 min-h-[46px] rounded-lg px-4 py-3">
					{button.text}
				</Button>
			</Link>
		)}
	</div>
);

const EmptyData = ({ emptyType }: { emptyType: string }) => {
	if (emptyType === 'task') {
		return (
			<StateSkeleton
				image={{
					light: '/images/add-new-task-light.png',
					dark: '/images/add-new-task-light.png',
					alt: 'Empty task state',
				}}
				title={EMPTY_TASK.title}
				message={EMPTY_TASK.message}
				button={EMPTY_TASK.button}
			/>
		);
	}

	if (emptyType === 'complete') {
		return (
			<StateSkeleton
				image={{
					light: '/images/complete-task-light.png',
					dark: '/images/complete-task-dark.png',
					alt: 'Empty completed task state',
				}}
				title={EMPTY_COMPLETE_TASK.title}
				message={EMPTY_COMPLETE_TASK.message}
				button={EMPTY_COMPLETE_TASK.button}
			/>
		);
	}
};

export default EmptyData;
