import { Module } from '@nestjs/common';
import { TypeORMDatabaseModule } from './typeorm/typeorm.module';

@Module({
    imports: [TypeORMDatabaseModule],
    exports: [TypeORMDatabaseModule]
})
export class DatabaseModule {}