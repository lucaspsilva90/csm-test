import { Lock } from '../../domain/entities/Lock';

export abstract class LockRepository {
    abstract acquireLock(resourceId: string): Promise<boolean>;
    abstract releaseLock(resourceId: string): Promise<void>;
}