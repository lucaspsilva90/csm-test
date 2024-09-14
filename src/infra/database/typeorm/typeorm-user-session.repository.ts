import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/domain/entities/Session';
import { Stream } from 'src/domain/entities/Stream';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { Repository } from 'typeorm';

@Injectable()
export class TypeORMUserSessionRepository implements UserSessionRepository {
    constructor(
        @InjectRepository(Session)
        private userSessionRepository: Repository<Session>,
        @InjectRepository(Stream)
        private streamRepository: Repository<Stream>,
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
    async deleteByUserId(session, streamId: string): Promise<void> {
        const streamSession = await this.userSessionRepository.findOne({ where: { userId: session.getUserId() } });

        if (!streamSession) {
            throw new UserSessionNotFoundError(session.getUserId());
        }
        
        await this.streamRepository.delete(streamId);
    }
}