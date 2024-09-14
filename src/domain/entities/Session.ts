import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Stream } from './Stream';
import { StreamLimit } from './value-objects/stream-limit';
import { StreamLimitReachedError } from '../errors/stream-limit-reached-error';
import { Transform } from 'class-transformer';
import { StreamLimitConflictError } from '../errors/stream-limit-conflict-error';

@Entity()
export class Session {

    @PrimaryGeneratedColumn('uuid')
    readonly userId: string;

    @Column('int')
    private streamLimitValue: number;

    private streamLimit: StreamLimit;

    @OneToMany(() => Stream, stream => stream.session, { cascade: true, eager: true })
    public activeStreams: Stream[]

    private constructor(userId: string, streamLimitValue: number) {
        this.userId = userId;
        this.setStreamLimit(streamLimitValue);
    }

    static create(userId: string, streamLimit: number): Session {
        const instance = new Session(userId, streamLimit);
        instance.activeStreams = [];
        return instance;
    }

    private canAddStream(): boolean {
        return this.activeStreams.length < this.streamLimit.getLimit();
    }

    public startStream(): void {
        if (!this.canAddStream()) {
            throw new StreamLimitReachedError();
        }
        const stream = Stream.create();
        this.activeStreams.push(stream);
    }

    public removeStream(sessionId: string): void {
        this.activeStreams = this.activeStreams.filter((session) => session.getStreamId() !== sessionId);
    }

    public updateStreamLimit(newLimit: number): void {
        const newStreamLimit = new StreamLimit(newLimit);

        if (newLimit < this.activeStreams.length) {
            throw new StreamLimitConflictError();
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

    public getActiveStreams(): Stream[] {
        return this.activeStreams;
    }

    public toDomain(): Session {
        const session = Session.create(this.userId, this.streamLimitValue);
        session.activeStreams = this.activeStreams;
        return session;
    }
}
