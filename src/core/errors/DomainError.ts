export class DomainError extends Error {
    additionalData: Object;

    constructor(message: string, additionalData?: Object) {
        super(message);
        this.additionalData = additionalData;
    }
}