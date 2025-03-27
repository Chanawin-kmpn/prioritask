import AuthForm from '@/components/forms/AuthForm';
import { signUpWithCredentials } from '@/lib/actions/auth.action';
import { SignUpSchema } from '@/lib/validations';
import React from 'react';

const SignUp = () => {
	return (
		<AuthForm
			formType="SIGN_UP"
			schema={SignUpSchema}
			defaultValue={{ name: '', email: '', password: '', confirmPassword: '' }}
		/>
	);
};

export default SignUp;
