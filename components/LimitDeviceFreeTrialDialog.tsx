import React from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import ROUTES from '@/constants/routes';
import Link from 'next/link';

const LimitDeviceFreeTrialDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="size-10 rounded-full md:size-12">
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="space-x-4">
					<DialogTitle className="text-center text-lg">
						🖐️ It looks like you're currently using a mobile or tablet device
					</DialogTitle>
					<DialogDescription className="text-center">
						Please log in first to get started. If you’d like to try the free
						trial, switch to a desktop device
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex flex-row">
					<DialogClose asChild>
						<Button
							variant="outline"
							className="cancel-btn flex-1 self-end"
							size="lg"
						>
							<X /> Cancel
						</Button>
					</DialogClose>
					<Button className="submit-btn flex-2" size="lg" asChild>
						<Link href={ROUTES.SIGN_IN}>Sign in</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LimitDeviceFreeTrialDialog;
