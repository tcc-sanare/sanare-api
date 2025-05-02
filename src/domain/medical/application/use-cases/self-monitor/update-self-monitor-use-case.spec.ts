import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { makeSelfMonitor } from "test/factories/make-self-monitor";
import { InMemorySelfMonitorRepository } from "test/repositories/in-memory-self-monitor-repository";
import { UpdateSelfMonitorUseCase } from "./update-self-monitor-use-case";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

describe('UpdateSelfMonitorUseCase', () => {
  let sut: UpdateSelfMonitorUseCase;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;

  beforeEach(() => {
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    sut = new UpdateSelfMonitorUseCase(inMemorySelfMonitorRepository);
  });

  it('should be able to update a self monitor', async () => {
    const selfMonitor = makeSelfMonitor();

    inMemorySelfMonitorRepository.items.push(selfMonitor);

    const result = await sut.execute({
      selfMonitorId: selfMonitor.id.toString(),
      caregiverId: 'new-caregiver-id',
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.selfMonitor).toBeInstanceOf(SelfMonitor);
    expect(result.value.selfMonitor.id.toString()).toEqual(selfMonitor.id.toString());
    expect(result.value.selfMonitor.caregiverId.toString()).toEqual('new-caregiver-id');
  });

  it('should not be able to update a self monitor if it does not exist', async () => {
    const result = await sut.execute({
      selfMonitorId: 'non-existing-id',
      caregiverId: 'new-caregiver-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});