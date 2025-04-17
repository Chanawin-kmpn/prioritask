'use client';
import React, { useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { deleteAccountConfirmText } from '@/lib/utils';
import { Trash2Icon, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useAuth } from '@/context/Auth';
import { deleteAccount, removeToken } from '@/lib/actions/auth.action';
import { deleteUser } from 'firebase/auth';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

const DeleteDialog = ({ id, username }: { id: string; username: string }) => {
	const auth = useAuth();
	const user = auth?.currentUser!;
	const confirmText = deleteAccountConfirmText(username);
	const [inputValue, setInputValue] = useState('');

	const handleDelete = async () => {
		if (inputValue === confirmText) {
			const { success } = await deleteAccount({ id }); // Delete user from firestore database

			if (!success) {
				toast.error('Failed to delete user');
				return;
			}

			await deleteUser(user);
			await removeToken();
			redirect('/');
		}
	};

	const isDeleteDisabled = inputValue !== confirmText;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="submit-btn w-fit self-end bg-red-500 hover:bg-red-400"
					size="lg"
				>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-center">
						Are you sure to delete this account?
					</DialogTitle>
					<DialogDescription className="text-center text-base">
						To confirm, type <span className="font-bold">"{confirmText}"</span>{' '}
						in the box below
					</DialogDescription>
					<DialogDescription className="text-center text-sm text-red-500">
						Please note: Deleting an account is permanent and cannot be undone
					</DialogDescription>
				</DialogHeader>
				<div>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Type here to confirm"
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button className="submit-btn w-fit self-end" size="lg">
							<X /> Cancel
						</Button>
					</DialogClose>
					<Button
						className="submit-btn w-fit self-end bg-red-500 hover:bg-red-400"
						size="lg"
						onClick={handleDelete}
						disabled={isDeleteDisabled}
					>
						<Trash2Icon /> Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteDialog;
