import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { GetMyAccountUseCase } from './get-my-account-use-case';
import { makeAccount } from 'test/factories/make-account';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';
import { GetCaregiverByUserIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case';
import { InMemoryCaregiverRepository } from 'test/repositories/in-memory-caregiver-repository';
import { InMemorySelfMonitorRepository } from 'test/repositories/in-memory-self-monitor-repository';

describe('GetMyAccountUseCase', () => {
  let getMyAccountUseCase: GetMyAccountUseCase;
  let getSelfMonitorbyAccountId: GetSelfMonitorByAccountIdUseCase;
  let getCaregiverByAccountId: GetCaregiverByUserIdUseCase;

  let inMemoryAccountRepository: InMemoryAccountRepository;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;
  let inMemoryCaregiverRepository: InMemoryCaregiverRepository;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    inMemoryCaregiverRepository = new InMemoryCaregiverRepository();

    getSelfMonitorbyAccountId = new GetSelfMonitorByAccountIdUseCase(inMemorySelfMonitorRepository);
    getCaregiverByAccountId = new GetCaregiverByUserIdUseCase(inMemoryCaregiverRepository);
    getMyAccountUseCase = new GetMyAccountUseCase(inMemoryAccountRepository, getSelfMonitorbyAccountId, getCaregiverByAccountId);
  });

  it('should return an account', async () => {
    const account = makeAccount();

    await inMemoryAccountRepository.create(account);

    const response = await getMyAccountUseCase.execute({
      accountId: account.id.toString(),
    });

    expect(response.isRight()).toBeTruthy();
    if (!response.isRight()) return;
    expect(response.value.account).toEqual(account);
    expect(response.value.account.name).toBe(account.name);
    expect(response.value.account.email).toBe(account.email);
  });

  it('should return null if account does not exist', async () => {
    const response = await getMyAccountUseCase.execute({
      accountId: '1',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
