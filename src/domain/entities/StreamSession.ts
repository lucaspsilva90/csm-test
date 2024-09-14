import { UUID, randomUUID } from 'crypto';

export class StreamSession {
  private streamId: UUID;
  private startedAt: Date;

  constructor(streamId?: UUID, startedAt?: Date) { 
    this.streamId = streamId ?? randomUUID()
    this.startedAt = startedAt ?? new Date();
  }

  getStreamId(): string {
    return this.streamId;
  }

  getStartedAt(): Date {
    return this.startedAt;
  }
}