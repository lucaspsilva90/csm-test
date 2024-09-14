import { randomUUID, UUID } from 'crypto';
import { CreateSessionUseCase } from '../../src/domain/use-cases/create-session';
import { UpdateSessionStreamLimitUseCase } from '../../src/domain/use-cases/update-stream-limit';
import { FakeUserSessionRepository } from '../repositories/fakeUserSessionRepository';


let userSessionRepository: FakeUserSessionRepository;
let updateSessionStreamLimitUseCase: UpdateSessionStreamLimitUseCase;
let createUserSessionUseCase: CreateSessionUseCase;
let uuid: UUID;

beforeEach(() => {
    userSessionRepository = new FakeUserSessionRepository();
    updateSessionStreamLimitUseCase = new UpdateSessionStreamLimitUseCase(userSessionRepository);
    createUserSessionUseCase = new CreateSessionUseCase(userSessionRepository);

    uuid = randomUUID();
    createUserSessionUseCase.execute({ userId: uuid, limit: 3 });
});


test('should update the stream limit', async () => {
    const response = await updateSessionStreamLimitUseCase.execute({ userId: uuid, limit: 5 });

    expect(response.message).toBe('Success');
    expect(response.session.getStreamLimit()).toBe(5);
});

test('should throw an error when the session is not found', async () => {
    await updateSessionStreamLimitUseCase.execute({ userId: randomUUID(), limit: 5 }).catch(error => {
        expect(error.message).toBe('User session not found');
    });
});