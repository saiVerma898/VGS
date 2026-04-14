import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _app: App | null = null;
let _db: Firestore | null = null;

function getAdminApp(): App {
  if (_app) return _app;

  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set");
  }

  const serviceAccount = JSON.parse(serviceAccountKey);
  _app = initializeApp({
    credential: cert(serviceAccount),
  });

  return _app;
}

export function getAdminDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getAdminApp());
  return _db;
}
