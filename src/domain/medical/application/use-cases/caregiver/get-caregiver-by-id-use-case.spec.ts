import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { makeCaregiver } from "test/factories/make-caregiver";
import { InMemoryCaregiverRepository } from "test/repositories/in-memory-caregiver-repository";
import { GetCaregiverByIdUseCase } from "./get-caregiver-by-id-use-case";

describe('GetCaregiverByIdUseCase', () => {
  let sut: GetCaregiverByIdUseCase;
  let inMemoryCaregiverRepository: InMemoryCaregiverRepository;

  beforeEach(() => {
    inMemoryCaregiverRepository = new InMemoryCaregiverRepository();
    sut = new GetCaregiverByIdUseCase(inMemoryCaregiverRepository);
  });

  it('should be able to get a caregiver by id', async () => {
    const caregiver = makeCaregiver();

    inMemoryCaregiverRepository.items.push(caregiver);

    const result = await sut.execute({
      id: caregiver.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.caregiver).toBeInstanceOf(Caregiver);
    expect(result.value?.caregiver.id.toString()).toEqual(caregiver.id.toString());
  });
  
  it('should not be able to get a caregiver by id if it does not exist', async () => {
    const caregiver = makeCaregiver();

    inMemoryCaregiverRepository.items.push(caregiver);

    const result = await sut.execute({
      id: 'non-existing-id',
    });

    expect(result.isLeft()).toBeTruthy();
  });
});