import { auth } from '../config/firebaseAdmin';
import { createUser, getUserById } from '../repositories/user.repository';
import type { AuthSuccessResponse } from '../types/auth.types';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const masked = local.charAt(0) + '***' + local.charAt(local.length - 1);
  return masked + '@' + domain;
}

export async function registerWithEmail(
  email: string,
  password: string
): Promise<AuthSuccessResponse> {
  const userRecord = await auth.createUser({
    email,
    password,
    emailVerified: false,
  });

  try {
    await createUser(userRecord.uid, email, 'email');
  } catch (error) {
    const masked = maskEmail(email);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(
      'Firestore write failed after Auth creation uid=' +
        userRecord.uid +
        ' email=' +
        masked +
        ': ' +
        message
    );
  }

  return {
    success: true,
    uid: userRecord.uid,
    email,
  };
}

export async function signInWithGoogle(
  idToken: string
): Promise<AuthSuccessResponse> {
  const decodedToken = await auth.verifyIdToken(idToken);
  const { uid, email } = decodedToken;

  if (!email) {
    throw new Error('Google account must have an email address');
  }

  const existingUser = await getUserById(uid);

  if (existingUser) {
    return {
      success: true,
      uid,
      email,
      isNewUser: false,
    };
  }

  await createUser(uid, email, 'google');

  return {
    success: true,
    uid,
    email,
    isNewUser: true,
  };
}