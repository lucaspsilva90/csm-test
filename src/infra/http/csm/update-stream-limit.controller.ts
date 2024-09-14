import { Body, ConflictException, Controller, InternalServerErrorException, Patch, ValidationPipe } from '@nestjs/common';
import { StreamLimitConflictError } from 'src/domain/errors/stream-limit-conflict-error';
import { UpdateSessionStreamLimitUseCase } from 'src/domain/use-cases/update-stream-limit';
import { UpdateStreamLimitDTO } from 'src/infra/dto/update-stream-limit-dto';

@Controller('session')
export class UpdateStreamLimitController {
    constructor(private updateStreamLimitUseCase: UpdateSessionStreamLimitUseCase) { }

    @Patch()
    async handle(@Body(new ValidationPipe()) { userId, limit }: UpdateStreamLimitDTO) {
        try {
            await this.updateStreamLimitUseCase.execute({ userId, limit });
        }
        catch (error) {
            if(error instanceof StreamLimitConflictError) {
                throw new ConflictException({ message: error.message });
            }
            throw new InternalServerErrorException({ message: error.message, errorStack: error.stack });
        }
    }
}