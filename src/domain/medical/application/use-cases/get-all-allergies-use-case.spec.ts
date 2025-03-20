import { makeAllergy } from "test/factories/make-allergy";
import { InMemoryAllergyRepository } from "test/repositories/in-memory-allergy-repository";
import { GetAllAllergiesUseCase } from "./get-all-allergies-use-case";

describe("GetAllAllergiesUseCase", () => {
    let sut: GetAllAllergiesUseCase;
    let inMemoryAllergyRepository: InMemoryAllergyRepository;

    beforeEach(() => {
        inMemoryAllergyRepository = new InMemoryAllergyRepository();
        sut = new GetAllAllergiesUseCase(
            inMemoryAllergyRepository
        );
    });

    it('should be return all allergies', async () => {
        const allergy1 = makeAllergy();
        const allergy2 = makeAllergy();

        await inMemoryAllergyRepository.create(allergy1);
        await inMemoryAllergyRepository.create(allergy2);

        const response = await sut.execute();

        expect(response.isRight()).toBeTruthy();
        expect(response.value.allergies.length).toEqual(2);
    });

    it('should be return an empty array if no allergy is found', async () => {
        const response = await sut.execute();

        expect(response.isRight()).toBeTruthy();
        expect(response.value.allergies).toHaveLength(0);
    });
});