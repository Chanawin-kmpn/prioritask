'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import {
	DefaultValues,
	FieldValue,
	FieldValues,
	useForm,
} from 'react-hook-form';
import { z, ZodType } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SocialAuthForm from './SocialAuthForm';
// import { createAccount, signInUser } from '@/lib/actions/users.actions';

interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T>;
	defaultValues: T;
	onSubmit: (data: T) => Promise<ActionResponse>;
	formType: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>({
	schema,
	defaultValues,
	formType,
	onSubmit,
}: AuthFormProps<T>) => {
	const [isLoading, setIsLoading] = useState(false);
	const [];
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<T>,
	});

	const onSubmit = async (values: z.infer<typeof schema>) => {};

	return (
		<div className="flex flex-col items-start justify-center gap-8 px-8">
			<div className="w-full space-y-2">
				<Image
					src="/images/prioritask-logo.png"
					alt="Prioritask-logo"
					width={200}
					height={80}
					className="mx-auto"
				/>

				<h2 className="text-xl font-bold">Create an account</h2>
				<p className="text-sm">
					Already have an account?{' '}
					<Link href="/sign-in" className="text-blue-600">
						Log in
					</Link>
				</p>
			</div>

			<div className="divider" />

			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your name..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Enter your email..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full rounded-md bg-black py-2 text-white"
							disabled={isLoading}
						>
							Create account
						</Button>

						<div className="my-4 flex items-center justify-center">
							<div className="h-px flex-1 bg-gray-300"></div>
							<span className="px-4 text-sm text-gray-500">Or</span>
							<div className="h-px flex-1 bg-gray-300"></div>
						</div>

						<SocialAuthForm />
					</form>
				</Form>
			</div>
		</div>
	);
};

export default AuthForm;
