import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateSessionDTO {
    @IsUUID()
    userId: string;

    @IsNumber()
    @Min(1)
    @Max(10)
    limit: number;
}