export const dashboardFilters = {
	priorityType: [
		{
			name: 'Do',
			value: 'do',
		},
		{ name: 'Schedule', value: 'schedule' },
		{ name: 'Delegate', value: 'delegate' },
		{ name: 'Delete', value: 'delete' },
	],
	createdAt: [
		{
			name: 'Newest',
			value: 'newest',
		},
		{ name: 'Oldest', value: 'oldest' },
	],
	priorityStatus: [
		{
			name: 'Complete',
			value: 'complete',
		},
		{ name: 'On Progress', value: 'on-progress' },
		{ name: 'Incomplete', value: 'incomplete' },
		{ name: 'Delete', value: 'delete' },
	],
};
