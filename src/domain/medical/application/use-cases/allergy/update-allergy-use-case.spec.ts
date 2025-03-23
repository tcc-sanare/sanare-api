import { InMemoryAllergyRepository } from 'test/repositories/in-memory-allergy-repository';
import { UpdateAllergyUseCase } from './update-allergy-use-case';
import { makeAllergy } from 'test/factories/make-allergy';
import { readFileSync } from 'fs';
import { InMemoryStorage } from 'test/storage/in-memory-storage';

describe('UpdateAllergyUseCase', () => {
  let sut: UpdateAllergyUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;
  let inMemoryStorage: InMemoryStorage;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    inMemoryStorage = new InMemoryStorage();
    sut = new UpdateAllergyUseCase(
      inMemoryAllergyRepository,
      inMemoryStorage
    );
  });

  it('should be update a allergy with a icon', async () => {
    const allergy = makeAllergy();

    await inMemoryAllergyRepository.create(allergy);

    const icon = new File(
      [
        new Blob(
          [
            readFileSync('./test/storage/test-files/al-icon.svg')
          ]
        )
      ],
      'al-icon.svg',
      { type: 'image/svg+xml' }
    );

    const response = await sut.execute({
      allergyId: allergy.id.toString(),
      name: 'new-name',
      description: 'new-description',
      icon: {
        fileName: icon.name,
        fileType: icon.type,
        buffer: Buffer.from(await icon.arrayBuffer())
      }
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toBeTruthy();
    expect(response.value.allergy.name).toEqual('new-name');
    expect(response.value.allergy.description).toEqual('new-description');
    expect(response.value.allergy.iconKey).toBeTruthy();
    expect(response.value.allergy.iconKey).toEqual(inMemoryStorage.items[0].fileKey);
    expect(inMemoryAllergyRepository.items.length).toEqual(1);
    expect(inMemoryStorage.items.length).toEqual(1);
  });

  it('should be update a allergy removing a icon', async () => {
    const icon = new File(
      [
        new Blob(
          [
            readFileSync('./test/storage/test-files/al-icon.svg')
          ]
        )
      ],
      'al-icon.svg',
      { type: 'image/svg+xml' }
    );

    const allergy = makeAllergy({
      iconKey: await inMemoryStorage.upload({
        fileName: icon.name,
        fileType: icon.type,
        buffer: Buffer.from(await icon.arrayBuffer())
      }).then((res) => res.fileKey)
    });

    await inMemoryAllergyRepository.create(allergy);

    const response = await sut.execute({
      allergyId: allergy.id.toString(),
      name: 'new-name',
      description: 'new-description',
      icon: null
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.allergy.id).toBeTruthy();
    expect(response.value.allergy.name).toEqual('new-name');
    expect(response.value.allergy.description).toEqual('new-description');
    expect(response.value.allergy.iconKey).toBeNull();
    expect(inMemoryAllergyRepository.items.length).toEqual(1);
    expect(inMemoryStorage.items.length).toEqual(0);
  })

  it('should be return null if allergy not found', async () => {
    const response = await sut.execute({
      allergyId: 'invalid-id',
      name: 'new-name',
      description: 'new-description',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});
