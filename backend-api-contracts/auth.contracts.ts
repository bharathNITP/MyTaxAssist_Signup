export interface SignUpRequest {
  email: string;
  password?: string;
}

export interface SignUpResponse {
  success: boolean;
  error?: string;
  errorCode?: string;
  user?: {
    uid: string;
    email: string;
  };
}
