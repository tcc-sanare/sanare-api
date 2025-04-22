import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { makeSelfMonitor } from "test/factories/make-self-monitor";
import { InMemorySelfMonitorRepository } from "test/repositories/in-memory-self-monitor-repository";
import { GetSelfMonitorByUserIdUseCase } from "./get-self-monitor-by-user-id-use-case";

describe('GetSelfMonitorByUserIdUseCase', () => {
  let sut: GetSelfMonitorByUserIdUseCase;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;

  beforeEach(() => {
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    sut = new GetSelfMonitorByUserIdUseCase(inMemorySelfMonitorRepository);
  });

  it('should be able to get a self monitor by user id', async () => {
    const selfMonitor = makeSelfMonitor();

    inMemorySelfMonitorRepository.items.push(selfMonitor);

    const result = await sut.execute({
      userId: selfMonitor.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.selfMonitor).toBeInstanceOf(SelfMonitor);
    expect(result.value.selfMonitor.userId.toString()).toEqual(selfMonitor.userId.toString());
  });

  it('should not be able to get a self monitor by user id if it does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existing-user-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeNull();
  });
});
