import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { SignUpRequest, SignUpResponse } from "../../../../backend-api-contracts/auth.contracts";

export const signUpUser = onCall<SignUpRequest, Promise<SignUpResponse>>(async (request) => {
  const { email, password } = request.data;

  if (!email || !password) {
    throw new HttpsError("invalid-argument", "Email and password are required.");
  }

  try {
    // 1. Check if user already exists in Firebase Auth
    try {
      await admin.auth().getUserByEmail(email);
      // If no error is thrown, the user exists
      return {
        success: false,
        error: "This email is already registered.",
        errorCode: "auth/email-already-in-use",
      };
    } catch (err: any) {
      // User does not exist if the error code is auth/user-not-found
      if (err.code !== "auth/user-not-found") {
        throw err;
      }
    }

    // 2. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // 3. Return success response
    return {
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email || email,
      },
    };
  } catch (error: any) {
    console.error("Error in signUpUser Cloud Function:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during registration.",
      errorCode: error.code || "unknown",
    };
  }
});
