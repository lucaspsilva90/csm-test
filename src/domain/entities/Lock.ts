import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('locks')
export class Lock {

    @PrimaryColumn()
    public resourceId: string;

    @CreateDateColumn()
    private lockedAt: Date;

    private lockExpirationTimeInSeconds: number = 30;

    private constructor(resourceId: string) {
        this.setLockResourceId(resourceId);
        this.lockedAt = this.createdLockedAt();
    }

    static create(resourceId: string): Lock {
        return new Lock(resourceId);
    }

    private createdLockedAt(): Date {
        this.lockedAt = new Date();

        return this.lockedAt;
    }

    private setLockResourceId(resourceId: string): void {
        this.resourceId = resourceId
    }

    getLockResourceId(): string {
        return this.resourceId;
    }

    getLockedAt(): Date {
        return this.lockedAt;
    }

    getLockDuration(): number {
        return this.lockExpirationTimeInSeconds
    }

}