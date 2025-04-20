import TaskForm from '../forms/TaskForm';
import { Task, TaskPriority } from '@/types/global';

interface MatrixProps {
	priorityType: TaskPriority;
	customBorder: string;
	dotColor: string; // สีของ task ในแต่ละ quadrant (optional)
	tasks: Task[];
}
// ดึง task มาเฉพาะที่ตรงกับ priorityType
const Matrix = ({
	priorityType,
	customBorder,
	dotColor,
	tasks,
}: MatrixProps) => {
	// การเพิ่มงานจริงควรเรียก action createTask()
	return (
		<div
			className={`relative grid w-fit grid-cols-5 grid-rows-5 ${customBorder}`}
		>
			<p className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl text-gray-100/50 uppercase">
				{priorityType}
			</p>

			{Array.from({ length: 25 }).map((_, i) => (
				<div
					key={i}
					className="z-10 flex size-[100px] items-center justify-center border border-gray-100"
				>
					{i < tasks.length && (
						<div className={`size-12 rounded-full ${dotColor} border`} />
					)}

					{i === tasks.length && tasks.length < 25 && (
						<TaskForm priorityType={priorityType} />
					)}
				</div>
			))}
		</div>
	);
};

export default Matrix;
