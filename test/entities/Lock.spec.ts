import { Lock } from '../../src/domain/entities/Lock';

test('should create a lock', () => {
    const lock = Lock.create('resource-id');

    expect(lock.getLockResourceId()).toBe('resource-id');
    expect(lock.getLockedAt()).toBeInstanceOf(Date);
});