import type { FastifyRequest, FastifyReply } from 'fastify';
import { registerWithEmail, signInWithGoogle } from '../services/auth.service';
import {
  registerEmailSchema,
  googleSignInSchema,
} from '../validations/auth.validation';
import type { AuthSuccessResponse, AuthErrorResponse } from '../types/auth.types';

function sendSuccess(
  reply: FastifyReply,
  statusCode: number,
  data: AuthSuccessResponse
): void {
  reply.status(statusCode).send(data);
}

function sendError(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  code?: string
): void {
  const body: AuthErrorResponse = {
    success: false,
    error: message,
    code,
  };
  reply.status(statusCode).send(body);
}

export async function registerEmailHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parseResult = registerEmailSchema.safeParse(request.body);

  if (!parseResult.success) {
    const firstError = parseResult.error.errors[0];
    sendError(reply, 400, firstError?.message ?? 'Validation failed');
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const result = await registerWithEmail(email, password);
    sendSuccess(reply, 201, result);
  } catch (error) {
    const firebaseErr = error as { code?: string };
    if (firebaseErr.code === 'auth/email-already-exists') {
      sendError(reply, 409, 'Email already registered', 'EMAIL_EXISTS');
      return;
    }
    request.log.error(error, 'Email registration failed');
    sendError(reply, 500, 'Internal server error');
  }
}

export async function googleSignInHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parseResult = googleSignInSchema.safeParse(request.body);

  if (!parseResult.success) {
    const firstError = parseResult.error.errors[0];
    sendError(reply, 400, firstError?.message ?? 'Invalid idToken');
    return;
  }

  const { idToken } = parseResult.data;

  try {
    const result = await signInWithGoogle(idToken);
    const statusCode = result.isNewUser ? 201 : 200;
    sendSuccess(reply, statusCode, result);
  } catch (error) {
    const firebaseErr = error as { code?: string };
    if (
      firebaseErr.code === 'auth/argument-error' ||
      firebaseErr.code === 'auth/id-token-expired' ||
      firebaseErr.code === 'auth/id-token-revoked'
    ) {
      sendError(reply, 400, 'Invalid or expired idToken');
      return;
    }
    request.log.error(error, 'Google sign-in failed');
    sendError(reply, 500, 'Internal server error');
  }
}