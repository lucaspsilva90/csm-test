import { UserSession } from '../entities/UserSession';
import { StreamLimitReachedError } from '../errors/stream-limit-reached-error';
import { UserSessionNotFoundError } from '../errors/user-session-not-found-error';
import { UserSessionRepository } from '../repository/user-session-repository';

interface StartStreamUseCaseInput {
    userId: string;
}

interface StartStreamUseCaseOutput {
    message: string;
    session: UserSession;
}

export class StartStreamUseCase {
    constructor(private userSessionRepository: UserSessionRepository) { }

    async execute({ userId }: StartStreamUseCaseInput): Promise<StartStreamUseCaseOutput> {
        const session = await this.userSessionRepository.findByUserId(userId);

        if (!session) {
            throw new UserSessionNotFoundError({ userId });
        }

        if (session.getActiveStreamCount() >= session.getStreamLimit()) {
            throw new StreamLimitReachedError({
                userId: session.getUserId(),
                streams: session.getActiveStreams()
            });
        }

        session.startStream();

        await this.userSessionRepository.updateSession(session);

        return {
            message: 'Success',
            session
        }
    }
}