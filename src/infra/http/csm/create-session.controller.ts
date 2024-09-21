import { Body, Controller, Post, UseFilters, ValidationPipe } from '@nestjs/common';
import { CreateSessionUseCase } from 'src/domain/use-cases/create-session';
import { CreateSessionDTO } from 'src/infra/dto/create-session.dto';
import { DomainExceptionFilter } from '../filters/domain-exception-filter';

@Controller('session')
export class CreateUseSessionController {

    constructor(
        private createSessionUseCase: CreateSessionUseCase
    ) { }

    @Post()
    @UseFilters(DomainExceptionFilter)
    async handle(@Body(new ValidationPipe()) { userId, limit }: CreateSessionDTO): Promise<void> {
        await this.createSessionUseCase.execute({ userId, limit });
    }
}