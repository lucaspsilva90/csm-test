import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StreamSession } from './StreamSession';
import { StreamLimit } from './value-objects/stream-limit';
import { StreamLimitReachedError } from '../errors/stream-limit-reached-error';
import { Transform } from 'class-transformer';

@Entity()
export class UserSession {

    @PrimaryGeneratedColumn('uuid')
    readonly userId: string;

    @Column('int')
    private streamLimitValue: number;

    private streamLimit: StreamLimit;

    @OneToMany(() => StreamSession, stream => stream.userSession)
    public activeStreams: StreamSession[]

    private constructor(userId: string, streamLimitValue: number) {
        this.userId = userId;
        this.setStreamLimit(streamLimitValue);
    }

    static create(userId: string, streamLimit: number): UserSession {
        const instance = new UserSession(userId, streamLimit);
        instance.activeStreams = [];
        return instance;
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
        this.setStreamLimit(newLimit)
    }

    private setStreamLimit(limit: number): void {
        this.streamLimit = new StreamLimit(limit);
        this.streamLimitValue = limit;
    }

    public getUserId(): string {
        return this.userId;
    }

    @Transform(({ value }) => new StreamLimit(value), { toClassOnly: true })
    @Transform(({ value }) => value, { toPlainOnly: true })
    public getStreamLimit(): StreamLimit {
        return new StreamLimit(this.streamLimitValue);
    }

    public getActiveStreamCount(): number {
        return this.activeStreams.length;
    }

    public getActiveStreams(): StreamSession[] {
        return this.activeStreams;
    }
}
