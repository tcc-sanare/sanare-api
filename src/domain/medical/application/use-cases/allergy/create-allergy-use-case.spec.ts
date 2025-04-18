import { InMemoryAllergyRepository } from 'test/repositories/in-memory-allergy-repository';
import { CreateAllergyUseCase } from './create-allergy-use-case';
import { makeAllergy } from 'test/factories/make-allergy';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { readFileSync } from 'fs';

describe('CreateAllergyUseCase', () => {
  let sut: CreateAllergyUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;
  let inMemoryStorage: InMemoryStorage;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    inMemoryStorage = new InMemoryStorage();
    sut = new CreateAllergyUseCase(inMemoryAllergyRepository, inMemoryStorage);
  });

  it('should be create a allergy without a icon', async () => {
    const allergy = makeAllergy();

    const response = await sut.execute(allergy);

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toBeTruthy();
    expect(response.value.allergy.name).toEqual(allergy.name);
    expect(response.value.allergy.description).toEqual(allergy.description);
    expect(inMemoryAllergyRepository.items.length).toEqual(1);
  });

  it('should be create a allergy with a icon', async () => {
    const icon = new File(
      [new Blob([readFileSync('./test/storage/test-files/al-icon.svg')])],
      'al-icon.svg',
      { type: 'image/svg+xml' },
    );

    const allergy = makeAllergy();

    const response = await sut.execute({
      name: allergy.name,
      description: allergy.description,
      icon: {
        fileName: icon.name,
        fileType: icon.type,
        buffer: Buffer.from(await icon.arrayBuffer()),
      },
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toBeTruthy();
    expect(response.value.allergy.name).toEqual(allergy.name);
    expect(response.value.allergy.description).toEqual(allergy.description);
    expect(response.value.allergy.iconKey).toBeTruthy();
    expect(response.value.allergy.iconKey).toEqual(
      inMemoryStorage.items[0].fileKey,
    );
    expect(inMemoryAllergyRepository.items.length).toEqual(1);
  });
});
