import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { UpdateMyAccountUseCase } from './update-my-account-use-case';
import { makeAccount } from 'test/factories/make-account';

describe('UpdateMyAccountUseCase', () => {
  let updateMyAccountUseCase: UpdateMyAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    updateMyAccountUseCase = new UpdateMyAccountUseCase(
      inMemoryAccountRepository,
    );
  });

  it('should update an account name', async () => {
    const account = await makeAccount();

    await inMemoryAccountRepository.save(account);

    const response = await updateMyAccountUseCase.execute({
      accountId: account.id.toString(),
      name: 'new name',
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toEqual(account);
    expect(response.value.account.name).toBe('new name');
  });

  it('should update an account theme', async () => {
    const account = await makeAccount();

    await inMemoryAccountRepository.save(account);

    const response = await updateMyAccountUseCase.execute({
      accountId: account.id.toString(),
      theme: 'DARK',
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toEqual(account);
    expect(response.value.account.theme).toBe('DARK');
  });

  it('should return null if account does not exist', async () => {
    const response = await updateMyAccountUseCase.execute({
      accountId: '1',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});
