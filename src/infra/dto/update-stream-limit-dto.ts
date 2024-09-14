import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class UpdateStreamLimitDTO {
    @IsUUID()
    userId: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    limit: number;
}