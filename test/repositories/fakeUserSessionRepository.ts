import { Session } from 'src/domain/entities/Session';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';

export class FakeUserSessionRepository implements UserSessionRepository {

    sessions: Session[] = [];

    async save(userSession: Session): Promise<void> {
        this.sessions.push(userSession);
    }

    async updateSession(session: Session): Promise<void> {
        this.sessions.forEach(s => { 
            if (s.getUserId() === session.getUserId()) {
                s = session;
            }
        });
    }

    async findByUserId(userId: string): Promise<Session | null> {
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