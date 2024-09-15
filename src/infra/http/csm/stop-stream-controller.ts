import { Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Post, ValidationPipe } from '@nestjs/common';
import { ResourceLocked } from 'src/domain/errors/resource-locked-error';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';
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
            if (error instanceof UserSessionNotFoundError) {
                throw new NotFoundException({ message: error.message });
            }
            if (error instanceof ResourceLocked) {
                throw new ConflictException({ message: error.message, additionalData: error.additionalData });
            }

            throw new InternalServerErrorException({ message: error.message, errorStack: error.stack });
        }
    }
}