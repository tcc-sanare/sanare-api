import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { makeSelfMonitor } from "test/factories/make-self-monitor";
import { InMemorySelfMonitorRepository } from "test/repositories/in-memory-self-monitor-repository";
import { GetSelfMonitorByIdUseCase } from "./get-self-monitor-by-id-use-case";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

describe('GetSelfMonitorByIdUseCase', () => {
  let sut: GetSelfMonitorByIdUseCase;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;

  beforeEach(() => {
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    sut = new GetSelfMonitorByIdUseCase(inMemorySelfMonitorRepository);
  });

  it('should be able to get a self monitor by id', async () => {
    const selfMonitor = makeSelfMonitor();

    inMemorySelfMonitorRepository.items.push(selfMonitor);

    const result = await sut.execute({
      selfMonitorId: selfMonitor.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.selfMonitor).toBeInstanceOf(SelfMonitor);
    expect(result.value.selfMonitor.id.toString()).toEqual(selfMonitor.id.toString());
  });

  it('should not be able to get a self monitor by id if it does not exist', async () => {
    const result = await sut.execute({
      selfMonitorId: 'non-existing-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
