import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { CreateUserSessionUseCase } from '../../src/domain/use-cases/create-user-session';
import { StartStreamUseCase } from '../../src/domain/use-cases/start-stream';
import { FakeUserSessionRepository } from '../../test/repositories/fakeUserSessionRepository';
import { StopStreamUseCase } from '../../src/domain/use-cases/stop-stream';

let userSessionRepository: UserSessionRepository;
let createUserSessionUseCase: CreateUserSessionUseCase;
let startStreamUseCase: StartStreamUseCase;
let stopStreamUseCase: StopStreamUseCase;

beforeEach(() => {
    userSessionRepository = new FakeUserSessionRepository();
    createUserSessionUseCase = new CreateUserSessionUseCase(userSessionRepository);
    startStreamUseCase = new StartStreamUseCase(userSessionRepository);
    stopStreamUseCase = new StopStreamUseCase(userSessionRepository);
});

test('should stop a stream successfully', async () => {
    const userId = '123'

    await createUserSessionUseCase.execute({ userId, limit: 3 });

    const streamToBeStopped = await startStreamUseCase.execute({ userId });
    await startStreamUseCase.execute({ userId });
    await startStreamUseCase.execute({ userId });

    await stopStreamUseCase.execute({ userId, streamId: streamToBeStopped.session.getActiveStreams()[0].getStreamId() });

    expect(streamToBeStopped.session.getActiveStreamCount()).toBe(2);
});

test('should throw an error when the user session is not found', async () => {
    const userId = '123'

    expect(async () => {
        await stopStreamUseCase.execute({ userId, streamId: '123' });
    }).rejects.toThrow('User session not found');
});