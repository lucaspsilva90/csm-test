import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/domain/entities/Session';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { Repository } from 'typeorm';

@Injectable()
export class TypeORMUserSessionRepository implements UserSessionRepository {
    constructor(
        @InjectRepository(Session)
        private userSessionRepository: Repository<Session>
    ) { }

    async save(userSession: Session): Promise<void> {
        await this.userSessionRepository.save(userSession);
    }
    async updateSession(session: Session): Promise<void> {
        await this.userSessionRepository.save(session);
    }

    async findByUserId(userId: string): Promise<Session | null> {
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