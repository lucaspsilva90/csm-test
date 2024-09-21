import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { ContextModule } from './infra/commons/context/context.module';
import { LoggerModule } from './infra/commons/logger/logger.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    ContextModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
