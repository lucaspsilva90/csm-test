import { Global, Module } from '@nestjs/common';
import { v4 } from 'uuid';
import { ClsModule } from 'nestjs-cls';
import { ContextService } from './context.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => v4(),
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: 'CONTEXT_STORAGE_SERVICE_KEY',
      useClass: ContextService,
    },
    ContextService,
  ],
  exports: ['CONTEXT_STORAGE_SERVICE_KEY'],
})
export class ContextModule {}
