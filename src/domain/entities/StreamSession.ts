import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserSession } from './UserSession';

@Entity()
export class StreamSession {
  
  @PrimaryGeneratedColumn('uuid')
  private streamId: string;

  @Column()
  private startedAt: Date;

  @ManyToOne(() => UserSession, userSession => userSession.activeStreams)
  public userSession: UserSession;

  constructor(startedAt?: Date) { 
    this.startedAt = startedAt ?? new Date();
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
