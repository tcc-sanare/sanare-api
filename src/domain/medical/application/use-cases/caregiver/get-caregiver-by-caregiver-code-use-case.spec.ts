import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { makeCaregiver } from "test/factories/make-caregiver";
import { InMemoryCaregiverRepository } from "test/repositories/in-memory-caregiver-repository";
import { GetCaregiverByCaregiverCodeUseCase } from "./get-caregiver-by-caregiver-code-use-case";

describe('GetCaregiverByCaregiverCodeUseCase', () => {
  let sut: GetCaregiverByCaregiverCodeUseCase;
  let inMemoryCaregiverRepository: InMemoryCaregiverRepository;

  beforeEach(() => {
    inMemoryCaregiverRepository = new InMemoryCaregiverRepository();
    sut = new GetCaregiverByCaregiverCodeUseCase(inMemoryCaregiverRepository);
  });

  it('should be able to get a caregiver by caregiver code', async () => {
    const caregiver = makeCaregiver();

    inMemoryCaregiverRepository.items.push(caregiver);

    const result = await sut.execute({
      caregiverCode: caregiver.code.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.caregiver).toBeInstanceOf(Caregiver);
    expect(result.value?.caregiver.code.toValue()).toEqual(caregiver.code.toValue());
  });
});