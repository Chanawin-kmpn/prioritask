'use client';
import { EditProfileSchema } from '@/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
	FormField,
	FormItem,
	FormControl,
	Form,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Link from 'next/link';
import { updateUser } from '@/lib/actions/auth.action';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { useAuth } from '@/context/Auth';
import { toast } from 'sonner';
import { error } from 'console';
import { useRouter } from 'next/navigation';

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
	const router = useRouter();
	const auth = useAuth();
	const user = auth?.currentUser!;
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

	const handleSubmit = async (values: z.infer<typeof EditProfileSchema>) => {
		if (username !== values.username) {
			const { success, error } = await updateUser({
				id,
				username: values.username,
			});
			if (success) {
				await auth?.updateUserProfile(values.username);
				toast.success('Update username successfully');
			} else {
				toast.error(error?.message);
			}
		}

		if (values.currentPassword && values.newPassword) {
			const response = await auth?.updateUserPassword(
				values.currentPassword,
				values.newPassword
			);

			if (!response?.success) {
				toast.error(response?.error?.message);
			} else {
				toast.success('Update password successfully');

				form.resetField('currentPassword');
				form.resetField('newPassword');
			}
		}

		router.refresh();
	};
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
											<FormMessage />
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
												<Input {...field} disabled />
											</FormControl>
											<FormMessage />
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
											<FormMessage />
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
											<FormMessage />
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
