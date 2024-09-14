import { DomainError } from '../../core/errors/DomainError';

export class StreamLimitConflictError extends DomainError {
    constructor(additionalData?: Object) {
        super('Cannot update stream limit because it is less than the number of active streams', additionalData);
    }
}