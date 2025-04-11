'use client';
import AuthForm from '@/components/forms/AuthForm';
import { validateSignInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/lib/validations';
import React from 'react';

const SignIn = () => {
	return (
		<AuthForm
			formType="SIGN_IN"
			defaultValues={{
				email: '',
				password: '',
			}}
			schema={SignInSchema}
			onSubmit={validateSignInWithCredentials}
		/>
	);
};

export default SignIn;
