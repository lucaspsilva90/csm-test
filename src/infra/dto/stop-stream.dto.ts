import { IsNotEmpty, IsUUID } from 'class-validator';

export class StopStreamDTO {
    @IsUUID()
    @IsNotEmpty()
    userId: string;
    @IsUUID()
    @IsNotEmpty()
    streamId: string;
}