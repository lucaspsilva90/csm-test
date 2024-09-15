import { Injectable } from '@nestjs/common';
import { Session } from '../entities/Session';
import { UserSessionNotFoundError } from '../errors/user-session-not-found-error';
import { UserSessionRepository } from '../repository/user-session-repository';

interface StopStreamUseCaseInput {
    userId: string;
    streamId: string;
}

interface StopStreamUseCaseOutput {
    message: string;
    session: Session;
}
@Injectable()
export class StopStreamUseCase {
    constructor(private userSessionRepository: UserSessionRepository) {}

    async execute({ userId, streamId }: StopStreamUseCaseInput): Promise<StopStreamUseCaseOutput> {
        const session = await this.userSessionRepository.findByUserId(userId);

        if (!session) {
            throw new UserSessionNotFoundError('Session not found');
        }

        session.removeStream(streamId);

        await this.userSessionRepository.deleteByUserId(session, streamId);

        return {
            message: 'Success',
            session
        }
    }
}