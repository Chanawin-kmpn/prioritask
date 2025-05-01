import ROUTES from './routes';

export const EMPTY_TASK = {
	title: 'Ohh! Seem like you have no task yet',
	message: 'Task dashboard is empty. Create your first task now!',
	button: {
		text: 'Create Task',
		href: ROUTES.HOME,
	},
};

export const EMPTY_COMPLETE_TASK = {
	title: 'You have tasks waiting to be completed!',
	message:
		'Stay focused and let’s get those tasks done. Your achievements await!',
	button: {
		text: 'Start Working',
		href: ROUTES.HOME,
	},
};
