import { Body, Controller, Post, UseFilters, ValidationPipe } from '@nestjs/common';

import { StartStreamUseCase } from 'src/domain/use-cases/start-stream';
import { StartStreamDTO, StartStreamResponseDTO } from 'src/infra/dto/start-stream.dto';
import { DomainExceptionFilter } from '../filters/domain-exception-filter';

@Controller('session')
export class StartStreamController {
    constructor(private startStreamUseCase: StartStreamUseCase) { }

    @Post('/stream/start')
    @UseFilters(DomainExceptionFilter)
    async handle(@Body(new ValidationPipe()) { userId }: StartStreamDTO): Promise<StartStreamResponseDTO> {
        const { message } = await this.startStreamUseCase.execute({ userId });

        return {
            message
        }
    }
}