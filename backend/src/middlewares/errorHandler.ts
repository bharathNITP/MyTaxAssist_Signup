import type { FastifyInstance, FastifyError } from 'fastify';

export interface AppError {
  statusCode: number;
  error: string;
  code?: string;
}

export function registerErrorHandler(server: FastifyInstance): void {
  server.setErrorHandler((fastifyError: FastifyError, _request, reply) => {
    const statusCode = fastifyError.statusCode ?? 500;

    if (statusCode >= 500) {
      server.log.error(
        { err: fastifyError },
        fastifyError.message ?? 'Internal server error'
      );
    }

    const body: AppError = {
      statusCode,
      error: fastifyError.message ?? 'Internal server error',
      code: (fastifyError as FastifyError & { code?: string }).code,
    };

    reply.status(statusCode).send(body);
  });
}
