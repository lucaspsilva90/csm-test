import { UserSession } from '../entities/UserSession';

export abstract class UserSessionRepository {
    abstract save(userSession: UserSession): Promise<void>;
    abstract updateSession(session: UserSession): Promise<void>;
    abstract findByUserId(userId: string): Promise<UserSession | null>;
    abstract deleteByUserId(userId: string): Promise<void>;
}