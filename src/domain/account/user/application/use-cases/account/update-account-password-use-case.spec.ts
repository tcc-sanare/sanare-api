import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { UpdateAccountPasswordUseCase } from './update-account-password-use-case';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAccount } from 'test/factories/make-account';
import { faker } from '@faker-js/faker';

describe('UpdateAccountPasswordUseCase', () => {
  let sut: UpdateAccountPasswordUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let fakeHasher: FakeHasher;
  let oldPassword: string;
  let newPassword: string;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdateAccountPasswordUseCase(
      inMemoryAccountRepository,
      fakeHasher,
      fakeHasher,
    );
    oldPassword = faker.internet.password();
    newPassword = faker.internet.password();
  });

  it('should be update password', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash(oldPassword),
    });

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      accountId: account.id.toString(),
      oldPassword,
      password: newPassword,
      confirmPassword: newPassword,
    });

    expect(response.isRight()).toBeTruthy();
    expect(
      await fakeHasher.compare(newPassword, response.value.account.password),
    ).toBeTruthy();
    expect(
      await fakeHasher.compare(
        newPassword,
        inMemoryAccountRepository.items[0].password,
      ),
    );
  });

  it('should be return null if password is incorrect', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash(oldPassword),
    });

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      accountId: account.id.toString(),
      oldPassword: 'aaaaa',
      password: newPassword,
      confirmPassword: newPassword,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
    expect(
      await fakeHasher.compare(
        oldPassword,
        inMemoryAccountRepository.items[0].password,
      ),
    ).toBeTruthy();
  });

  it('should be return null if the new passwords dont matched', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash(oldPassword),
    });

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      accountId: account.id.toString(),
      oldPassword,
      password: newPassword,
      confirmPassword: 'aaaaa',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
    expect(
      await fakeHasher.compare(
        oldPassword,
        inMemoryAccountRepository.items[0].password,
      ),
    ).toBeTruthy();
  });
});
