import { makeCaregiver } from "test/factories/make-caregiver";
import { CreateCaregiverUseCase } from "./create-caregiver-use-case"
import { InMemoryCaregiverRepository } from "test/repositories/in-memory-caregiver-repository";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";

describe('CreateCaregiverUseCase', () => {
  let sut: CreateCaregiverUseCase;
  let inMemoryCaregiverRepository: InMemoryCaregiverRepository;

  beforeEach(() => {
    inMemoryCaregiverRepository = new InMemoryCaregiverRepository();
    sut = new CreateCaregiverUseCase(inMemoryCaregiverRepository);
  });

  it('should be able to create a caregiver', async () => {
    const caregiver = makeCaregiver();
    
    const result = await sut.execute({
      userId: caregiver.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.caregiver).toBeInstanceOf(Caregiver);
    expect(result.value?.caregiver.userId.toString()).toEqual(caregiver.userId.toString());
    expect(inMemoryCaregiverRepository.items[0]).toEqual(result.value?.caregiver);
  });

  it('should not be able to create a caregiver with the same userId', async () => {
    const caregiver = makeCaregiver();
    
    inMemoryCaregiverRepository.items.push(caregiver);

    const result = await sut.execute({
      userId: caregiver.userId.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
  });
});
