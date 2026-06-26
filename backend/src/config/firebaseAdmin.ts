import admin from 'firebase-admin';

function getFirebaseCredentials(): admin.ServiceAccount {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin SDK credentials. ' +
        'Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in environment.'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

function initializeFirebase(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  const credentials = getFirebaseCredentials();

  return admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

const app = initializeFirebase();

export const auth = app.auth();
export const firestore = app.firestore();
export default app;
