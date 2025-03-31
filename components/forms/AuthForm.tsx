'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import {
	DefaultValues,
	FieldValue,
	FieldValues,
	Path,
	useForm,
} from 'react-hook-form';

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

interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T>;
	defaultValues: T;
	formType: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>({
	schema,
	defaultValues,
	formType,
}: AuthFormProps<T>) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<T>,
	});

	const onSubmit = async (values: z.infer<typeof schema>) => {
		if (formType === 'SIGN_UP') {
			console.log('Creating account...');
		}
	};

	const titleConfig = formTitles[formType];

	return (
		<div className="flex flex-col justify-center gap-8 px-8">
			<div className="w-full space-y-2">
				<Image
					src="/images/prioritask-logo.png"
					alt="Prioritask-logo"
					width={200}
					height={80}
					className="mx-auto"
				/>

				<div className="space-x-4">
					<h2 className="text-3xl font-bold">{titleConfig.heading}</h2>
					<div className="space-x-4">
						<p className="inline text-sm">{titleConfig.prompt}</p>
						<Link
							href={titleConfig.linkHref}
							className="text-dark100_light200 text-lg font-bold underline"
						>
							{titleConfig.linkText}
						</Link>
					</div>
				</div>
			</div>

			<div className="divider" />

			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
												className=""
											/>
										</FormControl>
										<FormMessage className="shad-form-message" />
									</FormItem>
								)}
							/>
						))}
						{formType === 'SIGN_IN' && (
							<div className="flex items-center justify-between">
								<div className="space-x-2">
									<Checkbox id="remember" />
									<Label htmlFor="remember">Remember me</Label>
								</div>
								<Link href="#" className="underline">
									Forget password
								</Link>
							</div>
						)}
						<div className="mt-4">
							<Button
								type="submit"
								size="lg"
								className="text-light-200 bg-dark-100 mb-0 w-full rounded-md py-4 text-base hover:bg-zinc-700"
								disabled={isLoading}
							>
								{titleConfig.submitBtn}
							</Button>

							<div className="my-[17px] flex items-center justify-center">
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
