import { DomainError } from '../../core/errors/DomainError';

export class UserAlreadyHasSession extends DomainError {
    constructor(additionalData?: Object) {
        super('User already has a session', additionalData);
    }
}