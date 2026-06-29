/**
 * apiClient — Centralized HTTP client for Fastify backend API calls.
 * Base URL sourced from EXPO_PUBLIC_API_BASE_URL env var.
 * No direct Firebase SDK calls in this module.
 */

const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) || 'http://localhost:3001';

export interface RegisterEmailRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterEmailResponse {
  success: boolean;
  uid: string;
  email: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  uid: string;
  email: string;
  isNewUser: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  data?: Record<string, unknown>;
}

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.error || data.message || 'Something went wrong. Please try again.';
    const apiError: ApiError = {
      status: response.status,
      message: errorMessage,
      data,
    };
    throw apiError;
  }

  return data as T;
}

export function registerWithEmail(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<RegisterEmailResponse> {
  return request<RegisterEmailResponse>('/api/v1/auth/register', {
    email,
    password,
    confirmPassword,
  });
}

export function registerWithGoogle(
  idToken: string,
): Promise<GoogleAuthResponse> {
  return request<GoogleAuthResponse>('/api/v1/auth/google', {
    idToken,
  });
}
