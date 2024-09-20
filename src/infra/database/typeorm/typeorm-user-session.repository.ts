import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/domain/entities/Session';
import { Stream } from 'src/domain/entities/Stream';
import { ResourceLocked } from 'src/domain/errors/resource-locked-error';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';
import { LockRepository } from 'src/domain/repository/lock-repository';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { Repository } from 'typeorm';

@Injectable()
export class TypeORMUserSessionRepository implements UserSessionRepository {
    constructor(
        @InjectRepository(Session)
        private userSessionRepository: Repository<Session>,
        @InjectRepository(Stream)
        private streamRepository: Repository<Stream>,
        private lockRepository: LockRepository
    ) { }

    private async acquireLock(resourceId: string): Promise<boolean> {
        const isLocked = await this.lockRepository.acquireLock(resourceId);

        return isLocked;
    }

    private async releaseLock(resourceId: string): Promise<void> {
        await this.lockRepository.releaseLock(resourceId);
    }

    async save(userSession: Session): Promise<void> {
        const isLocked = await this.acquireLock(userSession.getUserId());

        if (isLocked) {
            throw new ResourceLocked({
                userSession: userSession.getUserId()
            });
        }

        try {
            await this.userSessionRepository.save(userSession);
        }
        finally {
            await this.releaseLock(userSession.getUserId());
        }
    }

    async updateSession(session: Session): Promise<void> {
        const isLocked = await this.acquireLock(session.getUserId());

        if (isLocked) {
            throw new ResourceLocked({
                userSession: session.getUserId()
            });
        }

        try {
            await this.userSessionRepository.save(session);
        } finally {
            await this.releaseLock(session.getUserId());
        }
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
    
    async deleteByUserId(session: Session, streamId: string): Promise<void> {

        const streamSession = await this.userSessionRepository.findOne({ where: { userId: session.getUserId() } });

        if (!streamSession) {
            throw new UserSessionNotFoundError(session.getUserId());
        }

        const isLocked = await this.acquireLock(session.getUserId());

        if (isLocked) {
            throw new ResourceLocked({
                userSession: session.getUserId()
            });
        }

        try {
            await this.streamRepository.delete(streamId);
        } finally {
            await this.releaseLock(session.getUserId());
        }
    }
}