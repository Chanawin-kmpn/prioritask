import { Timestamp } from 'firebase-admin/firestore';

type ActionResponse<T = null> = {
	success: boolean; //* ถ้า success แล้ว data เป็นอย่างไร
	data?: T;
	error?: {
		//* ถ้า error แล้วเป็นอย่างไร
		message: string;
		detail?: Record<string, string[]>;
	};
	status?: number;
};

type ErrorResponse = ActionResponse<undefined> & { success: false };

interface RouteParams {
	//ข้อมูลเป็น object ที่มี Key และ value เป็น string
	params: Promise<Record<string, string>>;
	searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
	page?: number;
	pageSize?: number;
	query?: string;
	filter?: {
		createdAt?: string | undefined;
		priorityType?: string | undefined;
		priorityStatus?: string | undefined;
	};
	sort?: string;
}

type ActionType = 'PROFILE_UPDATE' | 'PASSWORD_CHANGE' | 'PASSWORD_RESET';
type TaskStatus = 'complete' | 'delete' | 'on-progress' | 'incomplete';
type TaskPriority = 'do' | 'schedule' | 'delegate' | 'delete';

interface FilterPriority {
	do: Task[];
	schedule: Task[];
	delegate: Task[];
	delete: Task[];
}

interface Task {
	id: string;
	userId?: string;
	name: string;
	description?: string | null;
	dueDate: Date;
	dueTime?: string | null;
	priority: TaskPriority;
	status: TaskStatus;
	notify: boolean;
	isPublic?: boolean;
	expirationDate?: Date;
	completedAt?: Date;

	createdAt: Timestamp | Date;
	updatedAt: Timestamp | Date;
}

type ChartDataCompletion = {
	date: string;
	complete: number;
	incomplete: number;
};

type ChartDataPriority = {
	date: string; // วันในเดือน
	do: number; // จำนวนที่มี priority เป็น 'do'
	schedule: number; // จำนวนที่มี priority เป็น 'schedule'
	delegate: number; // จำนวนที่มี priority เป็น 'delegate'
	delete: number; // จำนวนที่มี priority เป็น 'delete'
};

type ChartData = ChartDataCompletion | ChartDataPriority;
