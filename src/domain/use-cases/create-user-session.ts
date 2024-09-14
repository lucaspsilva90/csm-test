import { UserSession } from '../entities/UserSession';
import { StreamLimit } from '../entities/value-objects/stream-limit';
import { UserAlreadyHasSession } from '../errors/user-already-has-session-error';
import { UserSessionRepository } from '../repository/user-session-repository';

interface CreateUserSessionUseCaseInput {
    userId: string;
    limit: number;
}

interface CreateUserSessionUseCaseOutput {
    message: string;
}

export class CreateUserSessionUseCase {
    constructor(private userSessionRepository: UserSessionRepository) { }

    async execute({ userId, limit }: CreateUserSessionUseCaseInput): Promise<CreateUserSessionUseCaseOutput> {
        
        const userAlreadyHasActiveSession = await this.userSessionRepository.findByUserId(userId);
        
        if(userAlreadyHasActiveSession) {
            throw new UserAlreadyHasSession('User already has a session');
        }

        const streamLimit = new StreamLimit(limit);

        const userSession = new UserSession(userId, streamLimit);

        await this.userSessionRepository.save(userSession);

        return {
            message: 'Success'
        }
    }
}
