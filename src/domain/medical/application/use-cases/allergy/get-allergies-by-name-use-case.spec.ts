import { InMemoryAllergyRepository } from 'test/repositories/in-memory-allergy-repository';
import { GetAllergiesByNameUseCase } from './get-allergies-by-name-use-case';
import { makeAllergy } from 'test/factories/make-allergy';

describe('GetAllergiesByNameUseCase', () => {
  let sut: GetAllergiesByNameUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    sut = new GetAllergiesByNameUseCase(inMemoryAllergyRepository);
  });

  it('should be return one allergy', async () => {
    const allergy = makeAllergy();
    const allergy2 = makeAllergy({
      name: 'another-name',
    });

    await inMemoryAllergyRepository.create(allergy);
    await inMemoryAllergyRepository.create(allergy2);

    const response = await sut.execute({ name: allergy.name.substring(0, 3) });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergies.length).toEqual(1);
    expect(response.value.allergies[0].id).toEqual(allergy.id);
  });

  it('should be return two allergies', async () => {
    const allergy = makeAllergy();
    const allergy2 = makeAllergy({
      name: allergy.name.substring(0, allergy.name.length - 1),
    });

    await inMemoryAllergyRepository.create(allergy);
    await inMemoryAllergyRepository.create(allergy2);

    const response = await sut.execute({ name: allergy.name.substring(0, 3) });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergies.length).toEqual(2);
    expect(response.value.allergies[0].id).toEqual(allergy.id);
    expect(response.value.allergies[1].id).toEqual(allergy2.id);
  });

  it('should be return an empty array if no allergy is found', async () => {
    const response = await sut.execute({ name: 'invalid-name' });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergies).toHaveLength(0);
  });
});
