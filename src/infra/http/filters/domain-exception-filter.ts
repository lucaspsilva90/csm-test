import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ResourceLocked } from 'src/domain/errors/resource-locked-error';
import { StreamLimitConflictError } from 'src/domain/errors/stream-limit-conflict-error';
import { StreamLimitReachedError } from 'src/domain/errors/stream-limit-reached-error';
import { UserAlreadyHasSession } from 'src/domain/errors/user-already-has-session-error';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        if (exception instanceof UserSessionNotFoundError) {
            return response.status(404).json({
                statusCode: 404,
                message: exception.message,
                additionalData: exception?.additionalData,
            });
        }

        if (exception instanceof UserAlreadyHasSession || exception instanceof StreamLimitReachedError || 
            exception instanceof StreamLimitConflictError || exception instanceof ResourceLocked) {
            return response.status(409).json({
                statusCode: 409,
                message: exception.message,
                additionalData: exception?.additionalData,
            });
        }

        return response.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: exception.message || exception,
        });
    }
}