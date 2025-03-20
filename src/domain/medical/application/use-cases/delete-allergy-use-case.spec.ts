import { InMemoryAllergyRepository } from "test/repositories/in-memory-allergy-repository";
import { DeleteAllergyUseCase } from "./delete-allergy-use-case"
import { makeAllergy } from "test/factories/make-allergy";

describe("DeleteAllergyUseCase", () => {
  let sut: DeleteAllergyUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    sut = new DeleteAllergyUseCase(
      inMemoryAllergyRepository
    );
  });

  it('should be delete a allergy', async () => {
    const allergy = makeAllergy();

    await inMemoryAllergyRepository.create(allergy);

    const response = await sut.execute({
      allergyId: allergy.id.toString()
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toEqual(allergy.id);
    expect(inMemoryAllergyRepository.items.length).toEqual(0);
  });

  it('should be return null if allergy not found', async () => {
    const response = await sut.execute({
      allergyId: 'invalid-id',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});