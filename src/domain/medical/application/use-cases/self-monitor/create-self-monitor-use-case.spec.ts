import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { InMemorySelfMonitorRepository } from "test/repositories/in-memory-self-monitor-repository";
import { CreateSelfMonitorUseCase } from "./create-self-monitor-use-case";
import { makeSelfMonitor } from "test/factories/make-self-monitor";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

describe('CreateSelfMonitorUseCase', () => {
  let sut: CreateSelfMonitorUseCase;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;

  beforeEach(() => {
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    sut = new CreateSelfMonitorUseCase(inMemorySelfMonitorRepository);
  });

  it('should be able to create a self monitor', async () => {
    const result = await sut.execute({
      accountId: new UniqueEntityID('user-1'),
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.selfMonitor).toBeInstanceOf(SelfMonitor);
    expect(result.value.selfMonitor.accountId.toString()).toEqual('user-1');
    expect(result.value.selfMonitor.caregiverId).toBeUndefined();
    expect(inMemorySelfMonitorRepository.items[0].accountId.toString()).toEqual('user-1');
  });

  it('should not be able to create a self monitor if it already exists', async () => {
    const selfMonitor = makeSelfMonitor();

    inMemorySelfMonitorRepository.items.push(selfMonitor);

    const result = await sut.execute({
      accountId: selfMonitor.accountId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemorySelfMonitorRepository.items.length).toBe(1);
  });
});