import { ChartConfig } from '@/components/ui/chart';

export const chartDataCompletionConfig: ChartConfig = {
	complete: {
		label: 'Complete',
		color: 'var(--color-safe)',
	},
	incomplete: {
		label: 'Incomplete',
		color: 'var(--color-danger)',
	},
};

export const chartDataPriorityConfig: ChartConfig = {
	do: {
		label: 'Do',
		color: 'var(--color-do',
	},
	schedule: {
		label: 'Schedule',
		color: 'var(--color-schedule)',
	},
	delegate: {
		label: 'Delegate',
		color: 'var(--color-delegate)',
	},
	delete: {
		label: 'Delete',
		color: 'var(--color-delete)',
	},
};
