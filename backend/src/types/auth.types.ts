export type AuthProvider = 'email' | 'google';

export type UserRole = 'client';

export interface UserProfile {
  uid: string;
  email: string;
  provider: AuthProvider;
  role: UserRole;
  createdAt: FirebaseFirestore.Timestamp;
  isProfileComplete: boolean;
}

export interface RegisterEmailRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export interface AuthSuccessResponse {
  success: true;
  uid: string;
  email: string;
  isNewUser?: boolean;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  code?: string;
}
