import { create } from 'zustand';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../config/firebase';

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export type AuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/popup-closed-by-user'
  | 'auth/cancelled-popup-request'
  | 'unknown';

const errorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/operation-not-allowed': 'Email/password sign up is not enabled.',
  'auth/popup-closed-by-user': 'Google sign in was cancelled.',
  'auth/cancelled-popup-request': 'Google sign in was cancelled.',
};

function getErrorMessage(code: string): string {
  return errorMessages[code] || 'Something went wrong. Please try again.';
}

interface AuthStoreState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
}

export const authStore = create<AuthStoreState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: cred.user, loading: false });
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : 'unknown';
      set({ error: getErrorMessage(code), loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      set({ user: cred.user, loading: false });
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : 'unknown';
      set({ error: getErrorMessage(code), loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
