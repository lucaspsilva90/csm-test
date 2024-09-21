import { LockRepository } from 'src/domain/repository/lock-repository';
import { RedisService } from './redis-service';
import { Lock } from '../../../domain/entities/Lock';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisLockRepository implements LockRepository {

    constructor(private redis: RedisService) {}

    async acquireLock(resourceId: string): Promise<boolean> {
        const isLocked = await this.redis.getClient().get(resourceId);

        if(isLocked) {
            return true
        }

        const lock = Lock.create(resourceId);

        await this.redis.getClient().set(lock.getLockResourceId(), lock.getLockedAt().toString(), {
            EX: lock.getLockDuration()
        });
        return false;
    }
    async releaseLock(resourceId: string): Promise<void> {
        await this.redis.getClient().del(resourceId);
    }

}