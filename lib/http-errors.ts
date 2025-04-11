export class RequestError extends Error {
	statusCode: number; // รหัสสถานะ HTTP (เช่น 400, 404, 500)
	errors?: Record<string, string[]>; // เก็บข้อผิดพลาดในรูปแบบ {ชื่อฟิลด์: [ข้อความผิดพลาด]}

	constructor(
		statusCode: number,
		message: string,
		errors?: Record<string, string[]>
	) {
		super(message); // เรียกใช้ constructor ของคลาสแม่ (Error)
		this.statusCode = statusCode;
		this.errors = errors;
		this.name = 'RequestError';
	}
}

export class ValidationError extends RequestError {
	constructor(fieldErrors: Record<string, string[]>) {
		const message = ValidationError.formatFieldErrors(fieldErrors); // แปลงข้อผิดพลาดให้เป็นข้อความที่อ่านง่าย
		super(400, message, fieldErrors); // ส่ง status code 400 (Bad Request)
		this.name = 'ValidationError';
		this.errors = fieldErrors;
	}

	//แปลงข้อผิดพลาดให้เป็นรูปแบบที่อ่านง่าย
	static formatFieldErrors(errors: Record<string, string[]>): string {
		//แปลง Object เป็น Array และแปลงแต่ละรายการให้เป็นข้อความ
		const formattedMessages = Object.entries(errors).map(
			([field, messages]) => {
				//แปลงตัวอักษรแรกของชื่อ field เป็นตัวพิมพ์ใหญ่
				const fieldName = field.charAt(0).toUpperCase + field.slice(1);

				// ถ้าข้อความแรกคือ 'Required' ให้แสดงเป็น '[Field Name] is required'
				if (messages[0] === 'Request') {
					return `${fieldName} is required`;
				} else {
					// ถ้านอกนั้นให้เชื่อมทุกข้อความด้วย 'and'
					return messages.join(' and ');
				}
			}
		);

		// เชื่อมทุกข้อความของทุก Field ด้วยเครื่องหมาย ,
		return formattedMessages.join(', ');
	}
}

export class NotFoundError extends RequestError {
	constructor(resource: string) {
		super(404, `${resource} not found`);
		this.name = 'NotFoundError';
	}
}

export class ForbiddenError extends RequestError {
	constructor(message: string = 'Forbidden') {
		super(403, message);
		this.name = 'ForbiddenError';
	}
}

export class UnauthorizedError extends RequestError {
	constructor(message: string = 'Unauthorized') {
		super(401, message);
		this.name = 'UnauthorizedError';
	}
}
