import { Module } from '@nestjs/common';
import { CreateUseSessionController } from './csm/create-session.controller';
import { CreateSessionUseCase } from 'src/domain/use-cases/create-session';
import { DatabaseModule } from '../database/database.module';
import { StartStreamUseCase } from 'src/domain/use-cases/start-stream';
import { StartStreamController } from './csm/start-stream.controller';
import { UpdateSessionStreamLimitUseCase } from 'src/domain/use-cases/update-stream-limit';
import { UpdateStreamLimitController } from './csm/update-stream-limit.controller';
import { StopStreamUseCase } from 'src/domain/use-cases/stop-stream';
import { StopStreamController } from './csm/stop-stream-controller';

@Module({
    imports: [DatabaseModule],
    controllers: [
        CreateUseSessionController,
        UpdateStreamLimitController,
        StartStreamController,
        StopStreamController
    ],
    providers: [
        CreateSessionUseCase,
        UpdateSessionStreamLimitUseCase,
        StartStreamUseCase,
        StopStreamUseCase,    
    ],
    exports: []
})
export class HttpModule { }