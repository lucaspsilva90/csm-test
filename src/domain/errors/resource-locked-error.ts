import { DomainError } from '../../core/errors/DomainError';

export class ResourceLocked extends DomainError {
    constructor(additionalData?: Object) {
        super('Resource is locked', additionalData);
    }
}