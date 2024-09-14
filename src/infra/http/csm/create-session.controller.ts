import { Body, ConflictException, Controller, InternalServerErrorException, Post, ValidationPipe } from '@nestjs/common';
import { UserAlreadyHasSession } from 'src/domain/errors/user-already-has-session-error';
import { CreateSessionUseCase } from 'src/domain/use-cases/create-session';
import { CreateSessionDTO } from 'src/infra/dto/create-session.dto';


@Controller('session')
export class CreateUseSessionController {

    constructor(
        private createSessionUseCase: CreateSessionUseCase) { }

    @Post()
    async handle(@Body(new ValidationPipe()) { userId, limit }: CreateSessionDTO): Promise<void> {
        try {
            await this.createSessionUseCase.execute({ userId, limit });
        } catch (error) {
            if (error instanceof UserAlreadyHasSession) {
                throw new ConflictException(error.message);
            }

            throw new InternalServerErrorException({ message: 'Internal server error', error });
        }
    }
}