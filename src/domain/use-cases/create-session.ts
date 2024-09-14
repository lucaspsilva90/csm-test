import { Injectable } from '@nestjs/common';
import { UserSession } from '../entities/UserSession';
import { StreamLimit } from '../entities/value-objects/stream-limit';
import { UserAlreadyHasSession } from '../errors/user-already-has-session-error';
import { UserSessionRepository } from '../repository/user-session-repository';

interface CreateSessionUseCaseInput {
    userId: string;
    limit: number;
}

interface CreateSessionUseCaseOutput {
    message: string;
}

@Injectable()
export class CreateSessionUseCase {
    constructor(private readonly userSessionRepository: UserSessionRepository) { }

    async execute({ userId, limit }: CreateSessionUseCaseInput): Promise<CreateSessionUseCaseOutput> {
        
        const userAlreadyHasActiveSession = await this.userSessionRepository.findByUserId(userId);
        
        if(userAlreadyHasActiveSession) {
            throw new UserAlreadyHasSession('User already has a session');
        }

        const userSession = UserSession.create(userId, limit);

        await this.userSessionRepository.save(userSession);

        return {
            message: 'Success'
        }
    }
}
