import { randomUUID } from 'node:crypto';
import { UserSessionRepository } from '../../src/domain/repository/user-session-repository';
import { CreateSessionUseCase } from '../../src/domain/use-cases/create-session';
import { FakeUserSessionRepository } from '../repositories/fakeUserSessionRepository';

let createUserSessionUseCase: CreateSessionUseCase;
let userSessionRepository: UserSessionRepository;

beforeEach(() => {
    userSessionRepository = new FakeUserSessionRepository();
    createUserSessionUseCase = new CreateSessionUseCase(userSessionRepository);
});

test('it should create a user session', async () => {
  const uuid = randomUUID();

  const response = await createUserSessionUseCase.execute({
    userId: uuid,
    limit: 3
  });

  expect(response.message).toBe('Success');
});

test('it should throw an error when the user already has a session', async () => {
  const uuid = randomUUID();

  await createUserSessionUseCase.execute({
    userId: uuid,
    limit: 3
  });

  try {
    await createUserSessionUseCase.execute({
      userId: uuid,
      limit: 3
    });
  } catch (error) {
    expect(error.message).toBe('User already has a session');
  }
});