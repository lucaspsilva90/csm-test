import { StreamLimitReachedError } from '../errors/stream-limit-reached-error';
import { StreamSession } from './StreamSession';
import { StreamLimit } from './value-objects/stream-limit';


export class UserSession {
    private userId: string
    private activeStreams: StreamSession[] = [];
    private streamLimit: StreamLimit;

    constructor(userId: string, streamLimit: StreamLimit) {
        this.userId = userId;
        this.streamLimit = streamLimit;
    }

    private canAddStream(): boolean {
        return this.activeStreams.length < this.streamLimit.getLimit();
    }

    public startStream(): void {
        const stream = new StreamSession();
        if (!this.canAddStream()) {
            throw new StreamLimitReachedError();
        }
        this.activeStreams.push(stream);
    }

    public removeStream(sessionId: string): void {
        this.activeStreams = this.activeStreams.filter((session) => session.getStreamId() !== sessionId);
    }

    public updateStreamLimit(newLimit: number): void {
        const newStreamLimit = new StreamLimit(newLimit);
        if (newLimit < this.activeStreams.length) {
            throw new Error(`New stream limit cannot be less than the number of active streams.`);
        }
        this.streamLimit = newStreamLimit;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getStreamLimit(): number {
        return this.streamLimit.getLimit();
    }

    public getActiveStreamCount(): number {
        return this.activeStreams.length;
    }

    public getActiveStreams(): StreamSession[] {
        return this.activeStreams;
    }
}
