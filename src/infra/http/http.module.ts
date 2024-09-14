import { Module } from '@nestjs/common';
import { CreateUseSessionController } from './csm/create-session.controller';
import { CreateSessionUseCase } from 'src/domain/use-cases/create-session';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [CreateUseSessionController],
    providers: [
        CreateSessionUseCase
    ],
    exports: []
})
export class HttpModule { }