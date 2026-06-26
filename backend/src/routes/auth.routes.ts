import type { FastifyInstance } from 'fastify';
import {
  registerEmailHandler,
  googleSignInHandler,
} from '../controllers/auth.controller';

export async function authRoutes(server: FastifyInstance): Promise<void> {
  server.post('/api/v1/auth/register', registerEmailHandler);
  server.post('/api/v1/auth/google', googleSignInHandler);
}
