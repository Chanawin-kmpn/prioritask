'use client';
import { EditProfileSchema } from '@/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { FormField, FormItem, FormControl, Form } from '../ui/form';
import { Input } from '../ui/input';
import Link from 'next/link';

const EditProfileForm = ({
	id,
	username,
	email,
	providerType,
}: {
	id: string;
	username: string;
	email: string;
	providerType: string;
}) => {
	const isGoogleProvider = providerType === 'google.com';
	const form = useForm<z.infer<typeof EditProfileSchema>>({
		resolver: zodResolver(EditProfileSchema),
		defaultValues: {
			username: username || '',
			email: email || '',
			currentPassword: '',
			newPassword: '',
		},
	});

	const handleSubmit = async (values: z.infer<typeof EditProfileSchema>) => {};
	return (
		<div className="bg-light-100 rounded-[28px] border border-gray-100 p-8 dark:bg-zinc-800">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<fieldset
						disabled={form.formState.isSubmitting}
						className="flex flex-col gap-8"
					>
						<div className="flex items-center justify-between gap-12 p-4">
							<h2 className="text-dark100_light200 flex-1">Name</h2>
							<div className="flex-1">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="divider" />
						<div className="flex items-center justify-between gap-12 p-4">
							<h2 className="flex-1">Email</h2>
							<div className="flex-1">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													{...field}
													disabled={providerType === 'google.com'}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="divider" />
						<div className="flex items-center justify-between gap-12 p-4">
							<h2 className="flex-1">Password</h2>
							<div className="flex-1 space-y-4">
								<FormField
									control={form.control}
									name="currentPassword"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													{...field}
													type="password"
													disabled={providerType === 'google.com'}
													placeholder="Enter your current password"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													{...field}
													type="password"
													disabled={providerType === 'google.com'}
													placeholder="Enter your new password"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<p>
									Forgot your password?{' '}
									<span className="underline">
										<Link href="#">Recover your password</Link>
									</span>
								</p>
							</div>
						</div>
						<div className="divider" />
						<Button
							className="submit-btn w-fit self-end"
							type="submit"
							size="lg"
						>
							Update
						</Button>
					</fieldset>
				</form>
			</Form>
		</div>
	);
};

export default EditProfileForm;
