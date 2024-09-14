import { Module } from '@nestjs/common';
import { CreateUseSessionController } from './csm/create-session.controller';
import { CreateSessionUseCase } from 'src/domain/use-cases/create-session';
import { DatabaseModule } from '../database/database.module';
import { StartStreamUseCase } from 'src/domain/use-cases/start-stream';
import { StartStreamController } from './csm/start-stream.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [
        CreateUseSessionController,
        StartStreamController
    ],
    providers: [
        CreateSessionUseCase,
        StartStreamUseCase
    ],
    exports: []
})
export class HttpModule { }