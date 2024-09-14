import { Session } from '../entities/Session';

export abstract class UserSessionRepository {
    abstract save(userSession: Session): Promise<void>;
    abstract updateSession(session: Session): Promise<void>;
    abstract findByUserId(userId: string): Promise<Session | null>;
    abstract deleteByUserId(userId: string): Promise<void>;
}