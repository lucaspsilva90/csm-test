import { Body, ConflictException, Controller, InternalServerErrorException, Patch, UseFilters, ValidationPipe } from '@nestjs/common';
import { StreamLimitConflictError } from 'src/domain/errors/stream-limit-conflict-error';
import { UpdateSessionStreamLimitUseCase } from 'src/domain/use-cases/update-stream-limit';
import { UpdateStreamLimitDTO } from 'src/infra/dto/update-stream-limit-dto';
import { DomainExceptionFilter } from '../filters/domain-exception-filter';

@Controller('session')
export class UpdateStreamLimitController {
    constructor(private updateStreamLimitUseCase: UpdateSessionStreamLimitUseCase) { }

    @Patch()
    @UseFilters(DomainExceptionFilter)
    async handle(@Body(new ValidationPipe()) { userId, limit }: UpdateStreamLimitDTO) {
        await this.updateStreamLimitUseCase.execute({ userId, limit });
    }
}