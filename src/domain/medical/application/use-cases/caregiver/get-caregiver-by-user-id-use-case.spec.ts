import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { makeCaregiver } from "test/factories/make-caregiver";
import { InMemoryCaregiverRepository } from "test/repositories/in-memory-caregiver-repository";
import { GetCaregiverByUserIdUseCase } from "./get-caregiver-by-user-id-use-case";

describe('GetCaregiverByUserIdUseCase', () => {
  let sut: GetCaregiverByUserIdUseCase;
  let inMemoryCaregiverRepository: InMemoryCaregiverRepository;

  beforeEach(() => {
    inMemoryCaregiverRepository = new InMemoryCaregiverRepository();
    sut = new GetCaregiverByUserIdUseCase(inMemoryCaregiverRepository);
  });

  it('should be able to get a caregiver by user id', async () => {
    const caregiver = makeCaregiver();

    inMemoryCaregiverRepository.items.push(caregiver);

    const result = await sut.execute({
      userId: caregiver.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.caregiver).toBeInstanceOf(Caregiver);
    expect(result.value?.caregiver.userId.toString()).toEqual(caregiver.userId.toString());
  });

  it('should not be able to get a caregiver by user id if it does not exist', async () => {
    const caregiver = makeCaregiver();

    inMemoryCaregiverRepository.items.push(caregiver);

    const result = await sut.execute({
      userId: 'non-existing-user-id',
    });

    expect(result.isLeft()).toBeTruthy();
  });
});