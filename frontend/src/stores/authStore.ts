import { create } from 'zustand';

// The URL of Bharath's Middleware endpoint (Cloud Function)
const MIDDLEWARE_URL = process.env.EXPO_PUBLIC_MIDDLEWARE_URL || 'http://localhost:5001/mtassist-5eafc/us-central1/signUpUser';

export interface UserState {
  uid: string;
  email: string;
}

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
  user: UserState | null;
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
      // Call the middleware API using standard fetch
      const response = await fetch(MIDDLEWARE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { email, password },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      const result = json.result;

      if (result && result.success) {
        set({
          user: {
            uid: result.user.uid,
            email: result.user.email,
          },
          loading: false,
        });
      } else {
        const code = result?.errorCode || 'unknown';
        set({ error: getErrorMessage(code), loading: false });
      }
    } catch (err: any) {
      console.error('Error in signUp connection:', err);
      set({ error: err.message || 'Connection to middleware failed', loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      // Mock Google Sign-In or connect to another OAuth middleware endpoint
      console.log('Google Sign-In clicked (Redirect to OAuth middleware URL)');
      set({ loading: false });
    } catch (err: any) {
      set({ error: 'Google sign in failed', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
