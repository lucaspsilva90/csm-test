import { UserSession } from '../entities/UserSession';
import { UserSessionNotFoundError } from '../errors/user-session-not-found-error';
import { UserSessionRepository } from '../repository/user-session-repository';

interface StopStreamUseCaseInput {
    userId: string;
    streamId: string;
}

interface StopStreamUseCaseOutput {
    message: string;
    session: UserSession;
}

export class StopStreamUseCase {
    constructor(private userSessionRepository: UserSessionRepository) {}

    async execute({ userId, streamId }: StopStreamUseCaseInput): Promise<StopStreamUseCaseOutput> {
        const session = await this.userSessionRepository.findByUserId(userId);

        if (!session) {
            throw new UserSessionNotFoundError('Session not found');
        }

        session.removeStream(streamId);

        await this.userSessionRepository.updateSession(session);

        return {
            message: 'Success',
            session
        }
    }
}