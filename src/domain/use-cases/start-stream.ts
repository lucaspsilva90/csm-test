import { Injectable } from '@nestjs/common';
import { Session } from '../entities/Session';
import { StreamLimitReachedError } from '../errors/stream-limit-reached-error';
import { UserSessionNotFoundError } from '../errors/user-session-not-found-error';
import { UserSessionRepository } from '../repository/user-session-repository';

interface StartStreamUseCaseInput {
    userId: string;
}

interface StartStreamUseCaseOutput {
    message: string;
    session: Session;
}

@Injectable()
export class StartStreamUseCase {
    constructor(private userSessionRepository: UserSessionRepository) { }

    async execute({ userId }: StartStreamUseCaseInput): Promise<StartStreamUseCaseOutput> {
        const session = await this.userSessionRepository.findByUserId(userId);

        if (!session) {
            throw new UserSessionNotFoundError({ userId });
        }

        session.startStream();

        await this.userSessionRepository.updateSession(session);

        return {
            message: 'Success',
            session
        }
    }
}