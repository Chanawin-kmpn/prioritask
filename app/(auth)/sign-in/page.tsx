'use client';
import AuthForm from '@/components/forms/AuthForm';
import { validateSignInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/validations/validations';
import React from 'react';

const SignIn = () => {
	return (
		<AuthForm
			formType="SIGN_IN"
			schema={SignInSchema}
			defaultValues={{
				email: '',
				password: '',
			}}
			onSubmit={validateSignInWithCredentials}
		/>
	);
};

export default SignIn;
