import { InMemoryAllergyRepository } from "test/repositories/in-memory-allergy-repository";
import { GetAllergyByIdUseCase } from "./get-allergy-by-id-use-case"
import { makeAllergy } from "test/factories/make-allergy";

describe("GetAllergyByIdUseCase", () => {
  let sut: GetAllergyByIdUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    sut = new GetAllergyByIdUseCase(
      inMemoryAllergyRepository
    );
  });

  it('should be return a allergy', async () => {
    const allergy = makeAllergy();

    await inMemoryAllergyRepository.create(allergy);

    const response = await sut.execute({ allergyId: allergy.id.toString() });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toEqual(allergy.id);
    expect(response.value.allergy.name).toEqual(allergy.name);
    expect(response.value.allergy.description).toEqual(allergy.description);
  });

  it('should be return null if allergy not found', async () => {
    const response = await sut.execute({ allergyId: 'invalid-id' });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});