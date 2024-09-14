import { DomainError } from '../../core/errors/DomainError';

export class StreamLimitReachedError extends DomainError {
    constructor(additionalData?: Object) {
        super('Stream limit reached', additionalData);
    }
}