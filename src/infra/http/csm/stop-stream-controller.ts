import { Body, Controller, InternalServerErrorException, Post, ValidationPipe } from '@nestjs/common';
import { StopStreamUseCase } from 'src/domain/use-cases/stop-stream';
import { StopStreamDTO } from 'src/infra/dto/stop-stream.dto';

@Controller('session')
export class StopStreamController {
    constructor(private stopStreamUseCase: StopStreamUseCase) { }

    @Post('/stream/stop')
    async handle(@Body(new ValidationPipe()) { userId, streamId }: StopStreamDTO): Promise<void> {
        try {
            await this.stopStreamUseCase.execute({ userId, streamId });
        }
        catch (error) {
            throw new InternalServerErrorException({ message: error.message, errorStack: error.stack });
        }
    }
}