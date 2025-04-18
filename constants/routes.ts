const ROUTES = {
	HOME: '/',
	SIGN_IN: '/sign-in',
	SIGN_UP: '/sign-up',
	DASHBOARD: '/dashboard',
	PROFILE: (id: string) => `/profile/${id}`,
	FORGOT_PASSWORD: '/forgot-password',
};

export default ROUTES;
