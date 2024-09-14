import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Session } from './Session';
import { randomUUID, UUID } from 'crypto';

@Entity()
export class Stream {

  @PrimaryGeneratedColumn('uuid')
  private streamId: string;

  @Column()
  private startedAt: Date;

  @ManyToOne(() => Session, userSession => userSession.activeStreams)
  public session: Session;

  constructor(id: UUID, startedAt?: Date) {
    this.streamId = id ?? randomUUID();
    this.startedAt = startedAt ?? new Date();
  }

  public static create(id?: UUID, startDate?: Date) {
    return new Stream(id, startDate);
  }

  public getStreamId(): string {
    return this.streamId;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public getSession(): Session {
    return this.session;
  }

  public setUserSession(session: Session): void {
    this.session = session;
  }
}
