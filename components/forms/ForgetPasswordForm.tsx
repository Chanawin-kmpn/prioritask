'use client';
import { ForgotPasswordSchema } from '@/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { useAuth } from '@/context/Auth';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import ROUTES from '@/constants/routes';

const ForgetPasswordForm = () => {
	const auth = useAuth();
	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const handleSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
		const response = await auth?.resetUserPassword(values.email);

		if (!response?.success) {
			toast.error(response?.error?.message);
		}

		toast.success('Email sent! Please check your email');
		redirect(`${ROUTES.HOME}`);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-dark100_light200 text-base font-bold">
								Email
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Enter you email"
									className="bg-light200_dark100 border-gray-300"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="mt-4">
					<Button type="submit" size="lg" className="submit-btn">
						Send Email
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ForgetPasswordForm;
