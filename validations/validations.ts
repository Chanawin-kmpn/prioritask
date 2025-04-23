import { z } from 'zod';
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
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

export const ForgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Please provide a valid email address.' }),
});

export const TaskFormSchema = z.object({
	name: z.string().min(1, 'Task name is required'),
	description: z.string().nullable().optional(),

	// รับ Date (หรือ string แล้ว coerce เป็น Date) ตามที่ date‑picker ส่งมา
	dueDate: z.coerce.date({ required_error: 'Please pick a date' }),

	dueTime: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v === '' ? null : v))
		.refine((v) => !v || timeRegex.test(v), { message: 'Invalid time' })
		.nullable(),

	priority: z.enum(['do', 'schedule', 'delegate', 'delete']),
	status: z.enum(['done', 'delete', 'on-progress', 'incomplete']),
	notify: z.boolean(),
});

export const CreateTaskSchema = TaskFormSchema.extend({
	userId: z.string().optional(),
});

export const GetTasksSchema = z.object({
	priority: z.enum(['do', 'schedule', 'delegate', 'delete']).optional(),
	status: z.enum(['complete', 'incomplete']).optional(),
});

export const GetTasksByUserSchema = z.object({
	userId: z.string(),
});

export const SetTaskToCompleteSchema = z.object({
	taskId: z.string(),
	userId: z.string().optional(),
});

export const DeleteTaskByTaskIdSchema = z.object({
	taskId: z.string(),
	userId: z.string(),
});
