import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { DeleteAccountUseCase } from './delete-account-use-case';
import { makeAccount } from 'test/factories/make-account';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('DeleteAccountUseCase', () => {
  let sut: DeleteAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    sut = new DeleteAccountUseCase(inMemoryAccountRepository);
  });

  it('should delete an account', async () => {
    const account = makeAccount();

    await inMemoryAccountRepository.create(account);

    const response = await sut.execute({
      accountId: account.id.toString(),
    });

    expect(response.isRight()).toBeTruthy();
    if (!response.isRight()) return;
    expect(response.value.account).toEqual(account);
    expect(inMemoryAccountRepository.items).toHaveLength(0);
  });

  it('should return null if account does not exist', async () => {
    const response = await sut.execute({
      accountId: '1',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
