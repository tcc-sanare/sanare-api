import { InMemoryAllergyRepository } from "test/repositories/in-memory-allergy-repository";
import { CreateAllergyUseCase } from "./create-allergy-use-case"
import { makeAllergy } from "test/factories/make-allergy";

describe("CreateAllergyUseCase", () => {
  let sut: CreateAllergyUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    sut = new CreateAllergyUseCase(
      inMemoryAllergyRepository
    );
  });

  it('should be create a allergy', async () => {
    const allergy = makeAllergy();

    const response = await sut.execute(allergy);

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toBeTruthy();
    expect(response.value.allergy.name).toEqual(allergy.name);
    expect(response.value.allergy.description).toEqual(allergy.description);
    expect(inMemoryAllergyRepository.items.length).toEqual(1);
  });
});