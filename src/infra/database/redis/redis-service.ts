import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly client: RedisClientType = createClient({
        url: 'redis://redis:6379',
        isolationPoolOptions: {
            max: 5,
            min: 1,
            acquireTimeoutMillis: 1000,
        }
    });

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.disconnect();
    }

    getClient(): RedisClientType {
        return this.client;
    }
}