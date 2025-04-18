import { z } from 'zod';

const PasswordValidation = z
	.string()
	.min(6, { message: 'Password must be at least 6 characters long.' })
	.max(100, { message: 'Password cannot exceed 100 characters.' })
	.regex(/[A-Z]/, {
		message: 'Password must contain at least one uppercase letter.',
	})
	.regex(/[a-z]/, {
		message: 'Password must contain at least one lowercase letter.',
	})
	.regex(/[0-9]/, { message: 'Password must contain at least one number.' })
	.regex(/[^a-zA-Z0-9]/, {
		message: 'Password must contain at least one special character.',
	});

export const SignInSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Please provide a valid email address.' }),

	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long. ' })
		.max(100, { message: 'Password cannot exceed 100 characters.' }),
});

export const SignUpSchema = z
	.object({
		username: z
			.string()
			.min(1, { message: 'Name is required.' })
			.max(50, { message: 'Name cannot exceed 50 characters.' })
			.regex(/^[a-zA-Z\s]+$/, {
				message: 'Name can only contain letters and spaces.',
			}),

		email: z
			.string()
			.min(1, { message: 'Email is required.' })
			.email({ message: 'Please provide a valid email address.' }),

		password: PasswordValidation,

		confirmPassword: PasswordValidation,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password do not match',
		path: ['confirmPassword'],
	});

export const GetUserSchema = z.object({
	id: z.string().min(1, { message: 'User ID is required' }),
});

export const DeleteAccountSchema = z.object({
	id: z.string().min(1, { message: 'User ID is required' }),
});

export const EditProfileSchema = z.object({
	username: z
		.string()
		.min(1, { message: 'Name is required.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.regex(/^[a-zA-Z\s]+$/, {
			message: 'Name can only contain letters and spaces.',
		}),

	email: z
		.string()
		.min(1, { message: 'Email is required.' })
		.email({ message: 'Please provide a valid email address.' }),

	currentPassword: z.union([PasswordValidation, z.string().optional()]),
	newPassword: z.union([PasswordValidation, z.string().optional()]),
});

export const UpdateProfileSchema = z.object({
	id: z.string().min(1, { message: 'User ID is required' }),
	username: z
		.string()
		.min(1, { message: 'Name is required.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.regex(/^[a-zA-Z\s]+$/, {
			message: 'Name can only contain letters and spaces.',
		}),
});
