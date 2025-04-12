'use client';
import { EditProfileSchema } from '@/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { getUserById } from '@/lib/actions/auth.action';
import { useForm } from 'react-hook-form';

const ProfileDetail = ({
	uid,
	username,
	email,
	providerType,
}: {
	uid: string;
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
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
								<Input {...field} disabled={providerType === 'google.com'} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									disabled={providerType === 'google.com'}
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
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									disabled={providerType === 'google.com'}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default ProfileDetail;
