import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../config/firebaseAdmin';
import type { UserProfile, AuthProvider, UserRole } from '../types/auth.types';

const USERS_COLLECTION = 'users';

export async function createUser(
  uid: string,
  email: string,
  provider: AuthProvider
): Promise<UserProfile> {
  const userData: Omit<UserProfile, 'createdAt'> & {
    createdAt: FieldValue;
  } = {
    uid,
    email,
    provider,
    role: 'client' as UserRole,
    createdAt: FieldValue.serverTimestamp(),
    isProfileComplete: false,
  };

  await firestore.collection(USERS_COLLECTION).doc(uid).set(userData);

  const snapshot = await firestore.collection(USERS_COLLECTION).doc(uid).get();
  const data = snapshot.data() as UserProfile | undefined;

  if (!data) {
    throw new Error('Failed to read created user document');
  }

  return data;
}

export async function getUserById(uid: string): Promise<UserProfile | null> {
  const snapshot = await firestore.collection(USERS_COLLECTION).doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as UserProfile;
}
