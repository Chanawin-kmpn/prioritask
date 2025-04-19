'use client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface MatrixProps {
	priorityType: string;
	customBorder: string;
	dotColor?: string; // สีของ task ในแต่ละ quadrant (optional)
}

const Matrix = ({
	priorityType,
	customBorder,
	dotColor = 'bg-green-500',
}: MatrixProps) => {
	// เก็บรายการ task ของ quadrant นี้
	const [tasks, setTasks] = useState<Array<{ id: number }>>([]);

	// ฟังก์ชันเพิ่ม task
	const addTask = () => {
		if (tasks.length >= 25) return; // เต็มแล้ว ไม่เพิ่ม
		setTasks([...tasks, { id: Date.now() }]);
	};

	return (
		<div
			className={`relative grid w-fit grid-cols-5 grid-rows-5 ${customBorder}`}
		>
			{/* ข้อความเบลอสีเทาตรงกลาง */}
			<p className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl text-gray-100">
				{priorityType}
			</p>

			{Array.from({ length: 25 }).map((_, index) => (
				<div
					key={index}
					className="z-10 flex size-[100px] items-center justify-center border border-gray-100"
				>
					{/* ช่องที่มี task แล้ว */}
					{index < tasks.length && (
						<div
							className={`size-12 rounded-full ${dotColor} border-dark-100 dark:border-light-100 border`}
						/>
					)}

					{/* ช่องแรกว่างถัดจากงานล่าสุด */}
					{index === tasks.length && tasks.length < 25 && (
						<Button
							variant="outline"
							className="size-12 rounded-full"
							onClick={addTask}
						>
							<Plus />
						</Button>
					)}
					{/* ช่องอื่น ๆ ยังไม่ต้องแสดงอะไร */}
				</div>
			))}
		</div>
	);
};

export default Matrix;
