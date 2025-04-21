'use client';
import React, { useEffect, useState } from 'react';
import Matrix from './Matrix';
import { getTaskByUser } from '@/lib/actions/task.action';
import { Task } from '@/types/global';
import { auth } from '@/firebase/client';

interface FilterPriority {
	do: Task[];
	schedule: Task[];
	delegate: Task[];
	delete: Task[];
}

const EisenhowerMatrix = () => {
	const [user, setUser] = useState<{ uid: string } | null>(null);
	const [filterPriority, setFilterPriority] = useState<FilterPriority>({
		do: [],
		schedule: [],
		delegate: [],
		delete: [],
	});

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
			console.log(currentUser);

			if (currentUser) {
				const { uid } = currentUser;
				const { success, data, error } = await getTaskByUser({ userId: uid });

				console.log('Fetched Data:', data); // ดูข้อมูลที่ดึงมา

				if (!success) {
					console.log('Error', error?.message);
					return;
				}

				setUser({ uid });

				// จัดการ filterTask ใหม่
				const newFilterPriority = {
					do: data!.filter((task) => task.priority === 'do'),
					schedule: data!.filter((task) => task.priority === 'schedule'),
					delegate: data!.filter((task) => task.priority === 'delegate'),
					delete: data!.filter((task) => task.priority === 'delete'),
				};

				setFilterPriority(newFilterPriority);
				console.log('New Filter Priority:', newFilterPriority); // ดู filter priority ใหม่
			} else {
				// ผู้ใช้ไม่ได้ล็อกอิน
				setUser({ uid: 'guest' });
				setFilterPriority({ do: [], schedule: [], delegate: [], delete: [] });
			}
		});

		// ทำความสะอาด listener เมื่อ component จะถูก unmount
		return () => unsubscribe();
	}, []);

	// useEffect(() => {
	// 	console.log('Current User:', user);
	// }, [user]);

	// // ติดตามการเปลี่ยนแปลง filterPriority
	// useEffect(() => {
	// 	console.log('Current Filter Priority:', filterPriority);
	// }, [filterPriority]);

	return (
		<div className="relative p-14">
			<div className="absolute top-0 flex w-full max-w-[1000px] text-center">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Urgent
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Urgent
				</span>
			</div>
			<div className="grid w-fit grid-cols-2 justify-center">
				<Matrix
					userId={user?.uid}
					priorityType="do"
					customBorder="border-r border-b border-t-[1px] border-l-[1px] border-t-gray-100 border-l-gray-100"
					dotColor="bg-do"
					tasks={filterPriority.do}
				/>
				<Matrix
					userId={user?.uid}
					priorityType="schedule"
					customBorder="border-l border-b border-t-[1px] border-r-[1px] border-t-gray-100 border-r-gray-100"
					dotColor="bg-schedule"
					tasks={filterPriority.schedule}
				/>
				<Matrix
					userId={user?.uid}
					priorityType="delegate"
					customBorder="border-r border-t border-b-[1px] border-l-[1px] border-b-gray-100 border-l-gray-100"
					dotColor="bg-delegate"
					tasks={filterPriority.delegate}
				/>
				<Matrix
					userId={user?.uid}
					priorityType="delete"
					customBorder="border-l border-t border-b-[1px] border-r-[1px] border-b-gray-100 border-r-gray-100"
					dotColor="bg-delete"
					tasks={filterPriority.delete}
				/>
			</div>
			<div className="absolute bottom-0 left-0 flex w-full max-w-[1000px] origin-top-left -rotate-90 text-center">
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Not Important
				</span>
				<span className="text-dark-100 dark:text-light-100 pointer-events-none flex-1 text-5xl">
					Important
				</span>
			</div>
		</div>
	);
};

export default EisenhowerMatrix;
