import { InjectRepository } from '@nestjs/typeorm';
import { LockRepository } from 'src/domain/repository/lock-repository';
import { Repository } from 'typeorm';
import { Lock } from '../../../domain/entities/Lock';

export class TypeORMLockRepository implements LockRepository {
    constructor(
        @InjectRepository(Lock)
        private readonly lockRepository: Repository<Lock>
    ) { }

    async acquireLock(resourceId: string): Promise<boolean> {
        const isLocked = await this.lockRepository.findOne({ where: { resourceId: resourceId } });

        if (isLocked) {
            return true;
        }

        const lock = Lock.create(resourceId);

        try {
            await this.lockRepository.save(lock);
            return false;
        } catch (error) {
            return true;
        }
    }

    async releaseLock(resourceId: string): Promise<void> {
        await this.lockRepository.delete(resourceId);
    }
}