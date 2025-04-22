import { makeSelfMonitor } from "test/factories/make-self-monitor";
import { InMemorySelfMonitorRepository } from "test/repositories/in-memory-self-monitor-repository";
import { GetSelfMonitorsByCaregiverIdUseCase } from "./get-self-monitors-by-caregiver-id-use-case";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

describe('GetSelfMonitorsByCaregiverIdUseCase', () => {
  let sut: GetSelfMonitorsByCaregiverIdUseCase;
  let inMemorySelfMonitorRepository: InMemorySelfMonitorRepository;

  beforeEach(() => {
    inMemorySelfMonitorRepository = new InMemorySelfMonitorRepository();
    sut = new GetSelfMonitorsByCaregiverIdUseCase(inMemorySelfMonitorRepository);
  });

  it('should be able to get self monitors by caregiver id', async () => {
    const selfMonitor1 = makeSelfMonitor({ caregiverId: new UniqueEntityID('caregiver-1') });
    const selfMonitor2 = makeSelfMonitor({ caregiverId: new UniqueEntityID('caregiver-1') });
    const selfMonitor3 = makeSelfMonitor({ caregiverId: new UniqueEntityID('caregiver-2') });

    inMemorySelfMonitorRepository.items.push(selfMonitor1, selfMonitor2, selfMonitor3);

    const result = await sut.execute({
      caregiverId: 'caregiver-1',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.selfMonitors).toHaveLength(2);
    expect(result.value.selfMonitors[0].id.toString()).toEqual(selfMonitor1.id.toString());
    expect(result.value.selfMonitors[1].id.toString()).toEqual(selfMonitor2.id.toString());
  });

  it('should return an empty array if no self monitors are found for the caregiver id', async () => {
    const selfMonitor1 = makeSelfMonitor({ caregiverId: new UniqueEntityID('caregiver-1') });
    const selfMonitor2 = makeSelfMonitor({ caregiverId: new UniqueEntityID('caregiver-2') });

    inMemorySelfMonitorRepository.items.push(selfMonitor1, selfMonitor2);

    const result = await sut.execute({
      caregiverId: 'non-existing-caregiver-id',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.selfMonitors).toHaveLength(0);
  });
});
