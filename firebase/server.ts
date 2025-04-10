import admin, { ServiceAccount } from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

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

let auth: Auth;
const currentApps = getApps();

if (!currentApps.length) {
	// เช็คว่าแอปยังไม่ได้ถูกสร้างขึ้น
	const app = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount as ServiceAccount),
	}); // สร้างแอปขึ้นมาใหม่

	auth = getAuth(app);
} else {
	const app = currentApps[0];

	auth = getAuth(app);
}

export { auth };
