import { create } from "zustand";
import {
  registerWithEmail,
  registerWithGoogle,
  ApiError,
} from "../services/apiClient";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseAuth() {
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getAuth(app);
}

export interface UserState {
  uid: string;
  email: string;
}

interface AuthStoreState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean | null;
  signUp: (email: string, password: string, confirmPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const authStore = create<AuthStoreState>((set) => ({
  user: null,
  loading: false,
  error: null,
  isNewUser: null,

  signUp: async (email: string, password: string, confirmPassword: string) => {
    set({ loading: true, error: null });
    try {
      const result = await registerWithEmail(email, password, confirmPassword);
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      set({
        user: { uid: result.uid, email: result.email },
        isNewUser: true,
        loading: false,
      });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      let message = "Something went wrong. Please try again.";
      if (apiErr.status === 409) {
        message = "Email already registered";
      } else if (apiErr.status === 400) {
        message = apiErr.message;
      }
      set({ error: message, loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const credential: UserCredential = await signInWithPopup(auth, provider);
      const idToken: string = await credential.user.getIdToken();

      const result = await registerWithGoogle(idToken);
      set({
        user: { uid: result.uid, email: result.email },
        isNewUser: result.isNewUser ?? false,
        loading: false,
      });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.status) {
        const message =
          apiErr.status === 400
            ? "Invalid Google token. Please try again."
            : "Something went wrong with Google sign in. Please try again.";
        set({ error: message, loading: false });
        return;
      }
      const firebaseErr = err as { code?: string; message?: string };
      if (
        firebaseErr.code === "auth/popup-closed-by-user" ||
        firebaseErr.code === "auth/cancelled-popup-request"
      ) {
        set({ error: null, loading: false });
        return;
      }
      set({
        error: "Google Sign-In failed. Please try again.",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({ user: null, loading: false, error: null, isNewUser: null }),
}));