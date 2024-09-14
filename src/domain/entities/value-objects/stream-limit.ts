export class StreamLimit {
    private limit: number;

    constructor(value: number) {
        this.setLimit(value)
    }

    getLimit(): number {
        return this.limit;
    }

    setLimit(limit: number): void {
        if (limit < 1) throw Error('Limit must be greater than 0');
        this.limit = limit;
    }
}