import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { AuthenticateAccountUseCase } from "./authenticate-account-use-case";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Right } from "@/core/either";

describe('AuthenticateAccountUseCase', () => {
  let sut: AuthenticateAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let fakeHasher: FakeHasher;
  let fakeEncrypter: FakeEncrypter;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateAccountUseCase(
      inMemoryAccountRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should authenticate an account and return an access token', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash('password'),
    });

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      email: account.email,
      password: 'password',
    });

    expect(response.isRight()).toBe(true);
    if (!response.isRight()) return;
    expect(await fakeEncrypter.decrypt(response.value?.accessToken)).toEqual({
      sub: account.id.toString(),
    });
  });

  it('should return left if account is not found', async () => {
    const response = await sut.execute({
      email: 'non-existing-email',
      password: 'non-existing-password',
    });

    expect(response.isLeft()).toBe(true);
    if (!response.isLeft()) return;
    expect(JSON.parse(response.value.message).statusCode).toEqual(400);
    expect(inMemoryAccountRepository.items.length).toBe(0);
  });

  it('should return left if password is incorrect', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash('password'),
    });

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      email: account.email,
      password: 'wrong-password',
    });

    expect(response.isLeft()).toBe(true);
    if (!response.isLeft()) return;
    expect(JSON.parse(response.value.message).statusCode).toEqual(400);
  });
});