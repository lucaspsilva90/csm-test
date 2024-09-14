import { DomainError } from '../../core/errors/DomainError';

export class UserSessionNotFoundError extends DomainError {
    constructor(additionalData?: Object) {
        super('User session not found', additionalData);
    }
}