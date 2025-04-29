import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { CreateAccountUseCase } from './create-account-use-case';
import { makeAccount } from 'test/factories/make-account';
import { Account } from '../../../enterprise/entities/account';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryAccountRepository: InMemoryAccountRepository;
let fakeHasher: FakeHasher;
let sut: CreateAccountUseCase;

describe('CreateAccountUseCase', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateAccountUseCase(inMemoryAccountRepository, fakeHasher);
  });

  it('should create a new account', async () => {
    const account = makeAccount();

    const response = await sut.execute({
      name: account.name,
      email: account.email,
      password: account.password,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value.account).toBeInstanceOf(Account);
    expect(inMemoryAccountRepository.items[0]).toEqual(response.value.account);
    expect(response.value.account.name).toBe(account.name);
    expect(response.value.account.email).toBe(account.email);
  });

  it('shold return left if account is already registered', async () => {
    const firstAccount = makeAccount();

    await inMemoryAccountRepository.create(firstAccount);

    const secondAccount = makeAccount({
      email: firstAccount.email,
    });

    const response2 = await sut.execute({
      name: secondAccount.name,
      email: secondAccount.email,
      password: secondAccount.password,
    });

    expect(response2.isLeft()).toBe(true);
    expect(response2.value).toBeNull();
    expect(inMemoryAccountRepository.items.length).toBe(1);
  });
});
