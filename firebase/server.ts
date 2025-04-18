import admin, { ServiceAccount } from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore, Timestamp } from 'firebase-admin/firestore';

const serviceAccount = {
	type: 'service_account',
	project_id: 'prioritask-241099',
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY,
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40prioritask-241099.iam.gserviceaccount.com',
	universe_domain: 'googleapis.com',
};

let firestore: Firestore;
let auth: Auth;
const currentApps = getApps();

if (!currentApps.length) {
	// เช็คว่าแอปยังไม่ได้ถูกสร้างขึ้น
	const app = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount as ServiceAccount),
	}); // สร้างแอปขึ้นมาใหม่
	firestore = getFirestore(app);
	auth = getAuth(app);
} else {
	const app = currentApps[0];
	firestore = getFirestore(app);
	auth = getAuth(app);
}

async function checkServerRateLimit(
	userId: string,
	action: string,
	maxAttempts: number = 3,
	windowSeconds: number = 3600
): Promise<{ limited: boolean; message?: string }> {
	const limitRef = firestore
		.collection('rateLimits')
		.doc(`${action}_${userId}`);

	// ใช้ transaction เพื่อความถูกต้อง
	return await firestore.runTransaction(async (transaction) => {
		const doc = await transaction.get(limitRef);
		const now = Timestamp.now();
		const windowStart = new Timestamp(
			now.seconds - windowSeconds,
			now.nanoseconds
		);

		if (!doc.exists) {
			// สร้างใหม่
			transaction.set(limitRef, {
				attempts: 1,
				firstAttempt: now,
				lastAttempt: now,
				userId: userId,
			});
			return { limited: false };
		}

		const data = doc.data()!;

		// ถ้าผ่านช่วงเวลาที่กำหนดแล้ว รีเซ็ตนับใหม่
		if (data.firstAttempt.toDate() < windowStart.toDate()) {
			transaction.set(limitRef, {
				attempts: 1,
				firstAttempt: now,
				lastAttempt: now,
				userId: userId,
			});
			return { limited: false };
		}

		console.log('Data Attempts', data.attempts);
		console.log('Max Attempts', maxAttempts);

		// ถ้าเกินจำนวนครั้ง
		if (data.attempts >= maxAttempts) {
			const resetTime = new Date(
				data.firstAttempt.toDate().getTime() + windowSeconds * 1000
			);
			const minutesRemaining = Math.ceil(
				(resetTime.getTime() - Date.now()) / 60000
			);

			return {
				limited: true,
				message: `คุณได้อัพเดตโปรไฟล์เกินจำนวนครั้งที่กำหนด โปรดรออีก ${minutesRemaining} นาที`,
			};
		}

		// อัพเดตจำนวนครั้ง
		transaction.update(limitRef, {
			attempts: data.attempts + 1,
			lastAttempt: now,
		});

		return { limited: false };
	});
}

export { auth, firestore, checkServerRateLimit };
