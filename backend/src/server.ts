import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth.routes';
import { registerErrorHandler } from './middlewares/errorHandler';

function validateEnvironment(): void {
  const required = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(
        'Missing required environment variable: ' +
          key +
          '. Check your .env file or environment configuration.'
      );
    }
  }
}

function buildServer() {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
    },
  });

  registerErrorHandler(server);
  return server;
}

async function start(): Promise<void> {
  validateEnvironment();

  const server = buildServer();

  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(authRoutes);

  const port = parseInt(process.env.PORT ?? '3001', 10);
  const host = process.env.HOST ?? '0.0.0.0';

  try {
    await server.listen({ port, host });
    server.log.info('Server listening on ' + host + ':' + port);
  } catch (error) {
    server.log.error(error, 'Failed to start server');
    process.exit(1);
  }
}

start();
