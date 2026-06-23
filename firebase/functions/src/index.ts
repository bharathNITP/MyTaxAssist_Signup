import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Export HTTPS Callable Functions
export { signUpUser } from "./callable/user.callable";
