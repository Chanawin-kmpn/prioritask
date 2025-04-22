'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar1Icon, ClockIcon, Plus, X } from 'lucide-react';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar'; // DatePicker
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Task, TaskPriority } from '@/types/global';
import { TaskFormSchema } from '@/validations/validations';
import { createTask } from '@/lib/actions/task.action';
import { toast } from 'sonner';
import { useAuth } from '@/context/Auth';

interface Props {
	task?: Task;
	priorityType: TaskPriority;
	isEdit?: boolean;
	setTasks: (prevTask: any) => void;
}

export default function TaskForm({
	task,
	priorityType,
	isEdit = false,
	setTasks,
}: Props) {
	const auth = useAuth();
	const user = auth?.currentUser!;

	const defaultVals: z.infer<typeof TaskFormSchema> = {
		name: task?.name ?? '',
		description: task?.description ?? '',
		dueDate: task?.dueDate ?? new Date(),
		dueTime: task?.dueTime ?? '',
		priority: task?.priority ?? priorityType,
		status: task?.status ?? 'incomplete',
		notify: task?.notify ?? false,
	};

	const form = useForm<z.infer<typeof TaskFormSchema>>({
		resolver: zodResolver(TaskFormSchema),
		defaultValues: defaultVals,
	});

	const onSubmit = async (values: z.infer<typeof TaskFormSchema>) => {
		const { success, data, error } = await createTask({
			...values,
			userId: user?.uid,
		});

		if (!success) {
			toast.error(`${error?.message}. Please login first.`);
			return;
		}
		if (success) {
			if (!user) {
				const existingTasks = JSON.parse(
					localStorage.getItem('guestTasks') || '[]'
				);
				existingTasks.push(data); // data ควรเป็น task ที่ได้จากการสร้าง
				localStorage.setItem('guestTasks', JSON.stringify(existingTasks));
			}
			setTasks((prevTask: any) => [...prevTask, data]);

			toast.success('Create task successful!', {
				description:
					'🎯 Task locked and loaded! Your productivity is on fire today!  ',
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="size-12 rounded-full">
					<Plus />
				</Button>
			</DialogTrigger>

			<DialogContent className="gap-8 px-8 py-16">
				<DialogHeader>
					<DialogTitle className="pointer-events-none tracking-[8px]">
						CREATE TASK
					</DialogTitle>
					<DialogDescription className="pointer-events-none">
						Fill in the data below to add a new task
					</DialogDescription>
				</DialogHeader>

				<div className="divider" />

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-4">
							<p className="">Task Detail</p>
							{/* Task Name */}
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Task Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter your task name…" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Task Description */}
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Task Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Enter your task description..."
													{...field}
													value={field.value ?? ''}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="divider" />

						<div className="space-y-4">
							<p>Task Date</p>
							{/* Due Date */}
							<div className="flex items-center space-x-2.5">
								<FormField
									control={form.control}
									name="dueDate"
									render={({ field }) => (
										<FormItem className="flex flex-2 flex-col">
											<FormLabel>Due Date</FormLabel>
											<FormControl>
												<Popover modal>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className="border-input justify-between border bg-transparent p-3 text-left font-normal"
														>
															{field.value
																? format(field.value, 'PPP')
																: 'Pick a date'}
															<Calendar1Icon className="size-4" />
														</Button>
													</PopoverTrigger>

													<PopoverContent className="z-[60] p-4" align="start">
														{/* ───────── Quick pick ───────── */}
														<Select
															onValueChange={(value) => {
																const newDate = addDays(
																	new Date(),
																	Number(value)
																);
																field.onChange(newDate); // ← อัปเดตฟอร์ม
															}}
														>
															<SelectTrigger className="w-full border border-gray-100">
																<SelectValue placeholder="Select" />
															</SelectTrigger>
															<SelectContent
																position="popper"
																className="z-[60]"
															>
																<SelectItem value="0">Today</SelectItem>
																<SelectItem value="1">Tomorrow</SelectItem>
																<SelectItem value="3">In 3 days</SelectItem>
																<SelectItem value="7">In a week</SelectItem>
															</SelectContent>
														</Select>

														{/* ───────── Calendar ───────── */}
														<div className="mt-2 rounded-md border border-gray-100">
															<Calendar
																mode="single"
																selected={field.value}
																onSelect={field.onChange}
															/>
														</div>
													</PopoverContent>
												</Popover>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Due Time (ง่าย ๆ ใช้ <Input type="time">) */}
								<FormField
									control={form.control}
									name="dueTime"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Due Time</FormLabel>
											<FormControl className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50 relative overflow-hidden rounded-md transition-all">
												<div className="">
													<Input
														type="time"
														{...field}
														value={field.value ?? ''}
													/>
													<ClockIcon className="pointer-events-none absolute top-4 right-4 size-4" />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						{/* Notify me */}
						<FormField
							control={form.control}
							name="notify"
							render={({ field }) => (
								<FormItem className="flex items-center gap-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className="cursor-pointer">Notify me</FormLabel>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant="outline"
									className="cancle-btn w-fit self-end"
									size="lg"
									onClick={() => form.reset()}
								>
									<X /> Cancel
								</Button>
							</DialogClose>
							<Button type="submit" size="lg" className="submit-btn w-fit">
								<Plus /> Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
