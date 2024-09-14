import { UserSession } from 'src/domain/entities/UserSession';
import { StreamLimit } from '../../src/domain/entities/value-objects/stream-limit';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';

export class FakeUserSessionRepository implements UserSessionRepository {

    sessions: UserSession[] = [];

    async save(userSession: UserSession): Promise<void> {
        this.sessions.push(userSession);
    }

    async updateSession(session: UserSession): Promise<void> {
        this.sessions.forEach(s => { 
            if (s.getUserId() === session.getUserId()) {
                s = session;
            }
        });
    }

    async findByUserId(userId: string): Promise<UserSession | null> {
        const session = this.sessions.find(session => session.getUserId() === userId)

        if (!session) {
            return null;
        }

        return session;
    }
    deleteByUserId(userId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

}