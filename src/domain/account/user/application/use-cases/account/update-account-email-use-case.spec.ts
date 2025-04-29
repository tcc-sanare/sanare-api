import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { UpdateAccountEmailUseCase } from './update-account-email-use-case';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAccount } from 'test/factories/make-account';
import { faker } from '@faker-js/faker';

describe('UpdateAccountEmailUseCase', () => {
  let sut: UpdateAccountEmailUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let fakeHasher: FakeHasher;

  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryAccountRepository = new InMemoryAccountRepository();
    sut = new UpdateAccountEmailUseCase(
      inMemoryAccountRepository,
      fakeHasher,
    );
  });

  it('should be update email', async () => {
    const password = faker.internet.password();

    const account = makeAccount({
      password: await fakeHasher.hash(password),
      isVerified: true,
    });

    await inMemoryAccountRepository.create(account);

    const newEmail = faker.internet.email();

    const response = await sut.execute({
      accountId: account.id.toString(),
      email: newEmail,
      password: password,
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account.email).toBe(newEmail);
    expect(response.value.account.isVerified).toBeFalsy();
    expect(inMemoryAccountRepository.items[0].email).toBe(newEmail);
  });

  it('should be return null if the password is incorrect', async () => {
    const account = makeAccount({
      isVerified: true,
    });

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      accountId: account.id.toString(),
      email: faker.internet.email(),
      password: 'aaaaaaaaa',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(inMemoryAccountRepository.items[0].email).toBe(account.email);
    expect(inMemoryAccountRepository.items[0].isVerified).toBeTruthy();
  });
});
