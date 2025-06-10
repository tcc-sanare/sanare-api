import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { makeSelfMonitor } from "test/factories/make-self-monitor";
import { InMemorySelfMonitorRepository } from "test/repositories/in-memory-self-monitor-repository";
import { GetSelfMonitorByAccountIdUseCase } from "./get-self-monitor-by-account-id-use-case";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

describe('GetSelfMonitorByAccountIdUseCase', () => {
  let sut: GetSelfMonitorByAccountIdUseCase;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;

  beforeEach(() => {
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    sut = new GetSelfMonitorByAccountIdUseCase(inMemorySelfMonitorRepository);
  });

  it('should be able to get a self monitor by account id', async () => {
    const selfMonitor = makeSelfMonitor();

    inMemorySelfMonitorRepository.items.push(selfMonitor);

    const result = await sut.execute({
      accountId: selfMonitor.accountId,
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.selfMonitor).toBeInstanceOf(SelfMonitor);
    expect(result.value.selfMonitor.accountId.toString()).toEqual(selfMonitor.accountId.toString());
  });

  it('should not be able to get a self monitor by account id if it does not exist', async () => {
    const result = await sut.execute({
      accountId: new UniqueEntityID('non-existing-account-id'),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
