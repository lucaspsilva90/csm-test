import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeORMUserSessionRepository } from './typeorm-user-session.repository';
import { Session } from 'src/domain/entities/Session';
import { Stream } from 'src/domain/entities/Stream';
import { Lock } from 'src/domain/entities/Lock';
import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { LockRepository } from 'src/domain/repository/lock-repository';
import { RedisLockRepository } from '../redis/redis-lock-repository';
import { RedisService } from '../redis/redis-service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Session, Stream, Lock]),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: 'postgres',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'mydb',
                entities: [Session, Stream, Lock],
                synchronize: true,
            }),
            dataSourceFactory: async (options) => {
                const dataSource = new DataSource(options);
                await dataSource.initialize();
                return dataSource;
            }
        }),
    ],
    providers: [
        RedisService,
        {
           provide: LockRepository,
           useClass: RedisLockRepository 
        },
        {
            provide: UserSessionRepository,
            useClass: TypeORMUserSessionRepository
        }
    ],
    exports: [
        UserSessionRepository
    ]
})
export class TypeORMDatabaseModule implements OnModuleInit, OnModuleDestroy {
    constructor(private dataSource: DataSource) { }

    async onModuleInit() {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }
    }

    async onModuleDestroy() {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }

}