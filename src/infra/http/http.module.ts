import { Module } from '@nestjs/common';
import { CreateUseSessionController } from './csm/create-session.controller';
import { CreateSessionUseCase } from 'src/domain/use-cases/create-session';
import { DatabaseModule } from '../database/database.module';
import { StartStreamUseCase } from 'src/domain/use-cases/start-stream';
import { StartStreamController } from './csm/start-stream.controller';
import { UpdateSessionStreamLimitUseCase } from 'src/domain/use-cases/update-stream-limit';
import { UpdateStreamLimitController } from './csm/update-stream-limit.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [
        CreateUseSessionController,
        UpdateStreamLimitController,
        StartStreamController
    ],
    providers: [
        CreateSessionUseCase,
        UpdateSessionStreamLimitUseCase,
        StartStreamUseCase
        
    ],
    exports: []
})
export class HttpModule { }