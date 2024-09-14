import { Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Post, ValidationPipe } from '@nestjs/common';
import { StreamLimitReachedError } from 'src/domain/errors/stream-limit-reached-error';
import { UserSessionNotFoundError } from 'src/domain/errors/user-session-not-found-error';
import { StartStreamUseCase } from 'src/domain/use-cases/start-stream';
import { StartStreamDTO, StartStreamResponseDTO } from 'src/infra/dto/start-stream.dto';

@Controller('session')
export class StartStreamController {
    constructor(private startStreamUseCase: StartStreamUseCase) { }

    @Post('/stream/start')
    async handle(@Body(new ValidationPipe()) { userId }: StartStreamDTO): Promise<StartStreamResponseDTO> {
        try {
            const { message } = await this.startStreamUseCase.execute({ userId });

            return {
                message
            }
        } catch (error) {
            if (error instanceof UserSessionNotFoundError) {
                throw new NotFoundException({ message: error.message });
            }
            if (error instanceof StreamLimitReachedError) {
                throw new ConflictException({ message: error.message });
            }
            throw new InternalServerErrorException({ message: error.message, errorStack: error.stack });
        }
    }
}