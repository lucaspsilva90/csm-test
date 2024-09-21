import { Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Post, UseFilters, ValidationPipe } from '@nestjs/common';
import { ResourceLocked } from 'src/domain/errors/resource-locked-error';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';
import { StopStreamUseCase } from 'src/domain/use-cases/stop-stream';
import { StopStreamDTO } from 'src/infra/dto/stop-stream.dto';
import { DomainExceptionFilter } from '../filters/domain-exception-filter';

@Controller('session')
export class StopStreamController {
    constructor(private stopStreamUseCase: StopStreamUseCase) { }

    @Post('/stream/stop')
    @UseFilters(DomainExceptionFilter)
    async handle(@Body(new ValidationPipe()) { userId, streamId }: StopStreamDTO): Promise<void> {
        await this.stopStreamUseCase.execute({ userId, streamId });
    }
}