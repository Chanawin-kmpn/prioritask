'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';

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
import { z, ZodType } from 'zod';
import { formTitles } from '@/constants';
import { Label } from '@radix-ui/react-label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import ROUTES from '@/constants/routes';
import { useAuth } from '@/context/Auth';
import { ActionResponse } from '@/types/global';

interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T>;
	defaultValues: T;
	formType: 'SIGN_IN' | 'SIGN_UP';
	onSubmit: (data: T) => Promise<ActionResponse>;
}

const AuthForm = <T extends FieldValues>({
	schema,
	defaultValues,
	formType,
	onSubmit,
}: AuthFormProps<T>) => {
	const auth = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<T>,
	});

	const handleSubmit = async (values: z.infer<typeof schema>) => {
		if (onSubmit) {
			const result = (await onSubmit(values)) as ActionResponse;
			if (result.success) {
				const { email, password } = values;
				const response = await auth?.loginWithCredential(email, password);
				if (response?.success) {
					toast.success('Success', {
						description:
							formType === 'SIGN_UP'
								? 'Signed up successfully'
								: 'Signed in successfully',
					});
					window.location.href = ROUTES.HOME;
				} else {
					toast.error('Something went wrong!', {
						description: response?.error?.message.includes(
							'auth/invalid-credential'
						)
							? 'Invalid email or password'
							: response?.error?.message,
					});
				}
			} else {
				toast.error(`Error ${result?.status}`, {
					description: result?.error?.message,
				});
			}
		}
	};

	const titleConfig = formTitles[formType];

	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 py-4 md:px-8 lg:gap-8 lg:py-0">
			<div className="w-full space-y-2">
				<Image
					src="/images/prioritask-logo.png"
					alt="Prioritask-logo"
					width={200}
					height={80}
					className="mx-auto"
				/>

				<div className="max-md:text-center lg:space-x-4">
					<h2>{titleConfig.heading}</h2>
					<div className="space-x-4">
						<p className="inline text-sm">{titleConfig.prompt}</p>
						<Link
							href={titleConfig.linkHref}
							className="text-dark100_light200 text-base font-bold underline lg:text-lg"
						>
							{titleConfig.linkText}
						</Link>
					</div>
				</div>
			</div>

			<div className="divider" />

			<div className="w-full">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-2"
					>
						{Object.keys(defaultValues).map((field) => (
							<FormField
								key={field}
								control={form.control}
								name={field as Path<T>}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-dark100_light200 text-base font-bold">
											{field.name === 'confirmPassword'
												? 'Confirm Password'
												: field.name.charAt(0).toUpperCase() +
													field.name.slice(1)}
										</FormLabel>
										<FormControl>
											<Input
												required
												{...field}
												type={
													field.name === 'password' ||
													field.name === 'confirmPassword'
														? 'password'
														: 'text'
												}
												placeholder={`Enter your ${
													field.name === 'password' ||
													field.name === 'confirmPassword'
														? 'password'
														: field.name
												}...`}
												className="bg-light200_dark100 border-gray-300"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						{formType === 'SIGN_IN' && (
							<div className="flex items-center justify-between">
								<div className="space-x-2">
									<Checkbox
										id="remember"
										className="bg-light200_dark100 border-gray-300"
									/>
									<Label htmlFor="remember">Remember me</Label>
								</div>
								<Link href={ROUTES.FORGOT_PASSWORD} className="underline">
									Forget password
								</Link>
							</div>
						)}
						<div className="mt-4 flex gap-4 lg:block">
							<Button
								type="submit"
								size="lg"
								className="submit-btn flex-1 lg:w-full"
								disabled={isLoading}
							>
								{titleConfig.submitBtn}
							</Button>

							<div className="my-[17px] hidden items-center justify-center lg:flex">
								<div className="divider"></div>
								<span className="px-4 text-base text-gray-100">Or</span>
								<div className="divider"></div>
							</div>

							<SocialAuthForm title={titleConfig.oAuthBtn} />
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default AuthForm;
