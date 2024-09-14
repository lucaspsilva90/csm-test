import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserSession } from './UserSession';
import { randomUUID, UUID } from 'crypto';

@Entity()
export class StreamSession {
  
  @PrimaryGeneratedColumn('uuid')
  private streamId: string;

  @Column()
  private startedAt: Date;

  @ManyToOne(() => UserSession, userSession => userSession.activeStreams)
  public userSession: UserSession;

  constructor(id: UUID, startedAt?: Date) {
    this.streamId = id ?? randomUUID(); 
    this.startedAt = startedAt ?? new Date();
  }

  public static create(id?: UUID, startDate?: Date) {
    return new StreamSession(id, startDate);
  }

  public getStreamId(): string {
    return this.streamId;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public getUserSession(): UserSession {
    return this.userSession;
  }

  public setUserSession(userSession: UserSession): void {
    this.userSession = userSession;
  }
}
