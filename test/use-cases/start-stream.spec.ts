import { UserSessionRepository } from 'src/domain/repository/user-session-repository';
import { CreateUserSessionUseCase } from '../../src/domain/use-cases/create-user-session';
import { StartStreamUseCase } from '../../src/domain/use-cases/start-stream';
import { FakeUserSessionRepository } from '../../test/repositories/fakeUserSessionRepository';

let userSessionRepository: UserSessionRepository;
let createUserSessionUseCase: CreateUserSessionUseCase;
let startStreamUseCase: StartStreamUseCase;

beforeEach(() => {
    userSessionRepository = new FakeUserSessionRepository();
    createUserSessionUseCase = new CreateUserSessionUseCase(userSessionRepository);
    startStreamUseCase = new StartStreamUseCase(userSessionRepository);
});

test('should start a stream successfully', async () => {
    const userId = '123'

    await createUserSessionUseCase.execute({ userId, limit: 3 });

    const response = await startStreamUseCase.execute({ userId });

    expect(response.session.getActiveStreamCount()).toBe(1);
});

test('should throw an error when the stream limit is reached', async () => {
    const userId = '123'

    await createUserSessionUseCase.execute({ userId, limit: 1 });

    await startStreamUseCase.execute({ userId });

    expect(async () => {
        await startStreamUseCase.execute({ userId });
    }).rejects.toThrow('Stream limit reached');
});

test('should throw an error when the user session is not found', async () => {
    const userId = '123'

    expect(async () => {
        await startStreamUseCase.execute({ userId });
    }).rejects.toThrow('User session not found');
});