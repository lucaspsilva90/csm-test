import { IsUUID } from 'class-validator';

export class StreamDTO {
    id: string;
    streamId: string;
    startedAt: string;
}

export class StartStreamDTO {
    @IsUUID()
    userId: string;
}

export class StartStreamResponseDTO {
    message: string;
}