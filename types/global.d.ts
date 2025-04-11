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
