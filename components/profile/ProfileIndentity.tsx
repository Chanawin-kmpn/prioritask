import React from 'react';
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
} from '../ui/table';
import dayjs from 'dayjs';

const ProfileIndentity = ({
	email,
	providerType,
	createdAt,
}: {
	email: string;
	providerType: string;
	createdAt: Date;
}) => {
	return (
		<div className="bg-light100_dark800 rounded-[28px] border border-gray-100 p-8">
			<div className="flex flex-col justify-between gap-4 p-4 lg:flex-row lg:items-center lg:gap-12">
				<h2 className="text-dark100_light200 flex-1">Identites</h2>
				<div className="flex-1">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Provider</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Created At</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell className="font-medium">
									{providerType === 'google.com' ? 'Google' : 'Credential'}
								</TableCell>
								<TableCell>{email}</TableCell>
								<TableCell>{dayjs(createdAt).format('D MMMM YYYY')}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default ProfileIndentity;
