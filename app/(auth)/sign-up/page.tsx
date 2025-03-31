'use client';
import AuthForm from '@/components/forms/AuthForm';
import { SignUpSchema } from '@/lib/validations';
import React from 'react';

const SignUp = () => {
	return (
		<AuthForm
			formType="SIGN_UP"
			schema={SignUpSchema}
			defaultValues={{
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
			}}
		/>
	);
};

export default SignUp;
