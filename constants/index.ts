export const formTitles = {
	SIGN_UP: {
		heading: 'Create an account',
		prompt: 'Already have an account?',
		linkText: 'Sign in',
		linkHref: '/sign-in',
		submitBtn: 'Create account',
		oAuthBtn: 'Sign up with Google',
	},
	SIGN_IN: {
		heading: 'Welcome back',
		prompt: "Don't have an account?",
		linkText: 'Sign up',
		linkHref: '/sign-up',
		submitBtn: 'Sign in',
		oAuthBtn: 'Sign in with Google',
	},
};

export const taskStatusBadge = {
	complete: {
		label: 'Complete',
		className: 'bg-green-200 text-green-800',
	},
	'on-progress': {
		label: 'On Progress',
		className: 'bg-blue-200 text-blue-800',
	},
	incomplete: {
		label: 'Incomplete',
		className: 'bg-red-200 text-red-800',
	},
	delete: {
		label: 'Delete',
		className: 'bg-zinc-200 text-zinc-800',
	},
};

export const taskPriorityBadge = {
	do: {
		label: 'Do',
		className: 'bg-do/20 text-do',
	},
	schedule: {
		label: 'Schedule',
		className: 'bg-schedule/20 text-schedule',
	},
	delegate: {
		label: 'Delegate',
		className: 'bg-delegate/20 text-delegate',
	},
	delete: {
		label: 'Delete',
		className: 'bg-delete/20 text-delete',
	},
};
