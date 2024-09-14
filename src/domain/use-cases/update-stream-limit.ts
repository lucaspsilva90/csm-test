import { UserSessionNotFoundError } from '../errors/user-session-not-found-error';
import { UserSessionRepository } from '../repository/user-session-repository';
import { Session } from '../entities/Session';
import { Injectable } from '@nestjs/common';

interface UpdateSessionStreamLimitUseCaseInput {
    userId: string;
    limit: number;
}

export interface UpdateSessionStreamLimitUseCaseOutput {
    message: string;
    session: Session;
}
@Injectable()
export class UpdateSessionStreamLimitUseCase {
    constructor(private userSessionRepository: UserSessionRepository) { }

    async execute({ userId, limit }: UpdateSessionStreamLimitUseCaseInput): Promise<UpdateSessionStreamLimitUseCaseOutput> {
        const session = await this.userSessionRepository.findByUserId(userId);

        if (!session) {
            throw new UserSessionNotFoundError({ userId });
        }

        session.updateStreamLimit(limit);

        await this.userSessionRepository.updateSession(session);

        return {
            message: 'Success',
            session
        }
    }
}