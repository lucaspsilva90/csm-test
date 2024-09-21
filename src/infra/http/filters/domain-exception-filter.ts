import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ResourceLocked } from 'src/domain/errors/resource-locked-error';
import { StreamLimitConflictError } from 'src/domain/errors/stream-limit-conflict-error';
import { StreamLimitReachedError } from 'src/domain/errors/stream-limit-reached-error';
import { UserAlreadyHasSession } from 'src/domain/errors/user-already-has-session-error';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const reply = context.getResponse<FastifyReply>();

        if (exception instanceof UserSessionNotFoundError) {
            return reply.status(404).send({
                statusCode: 404,
                message: exception.message,
                additionalData: exception?.additionalData,
            });
        }

        if (exception instanceof UserAlreadyHasSession || exception instanceof StreamLimitReachedError || 
            exception instanceof StreamLimitConflictError || exception instanceof ResourceLocked) {
            return reply.status(409).send({
                statusCode: 409,
                message: exception.message,
                additionalData: exception?.additionalData,
            });
        }

        return reply.status(500).send({
            statusCode: 500,
            message: 'Internal server error',
            error: exception.message || exception,
        });
    }
}
