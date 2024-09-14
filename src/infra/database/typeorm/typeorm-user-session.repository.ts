import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from 'src/domain/entities/UserSession';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { Repository } from 'typeorm';

@Injectable()
export class TypeORMUserSessionRepository implements UserSessionRepository {
    constructor(
        @InjectRepository(UserSession)
        private userSessionRepository: Repository<UserSession>
    ) { }

    async save(userSession: UserSession): Promise<void> {
        await this.userSessionRepository.save(userSession);
    }
    async updateSession(session: UserSession): Promise<void> {
        await this.userSessionRepository.save(session);
    }

    async findByUserId(userId: string): Promise<UserSession | null> {
        const sessionModel = await this.userSessionRepository.findOne({
            where: { userId }, relations: {
                activeStreams: true
            }
        });

        if (!sessionModel) return null;

        return sessionModel.toDomain();
    }
    deleteByUserId(userId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}