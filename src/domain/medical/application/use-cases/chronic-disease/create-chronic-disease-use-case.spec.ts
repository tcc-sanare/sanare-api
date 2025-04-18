import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { CreateChronicDiseaseUseCase } from './create-chronic-disease-use-case';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';
import { readFileSync } from 'node:fs';

describe('CreateChronicDiseaseUseCase', () => {
  let sut: CreateChronicDiseaseUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;
  let inMemoryStorage: InMemoryStorage;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    inMemoryStorage = new InMemoryStorage();
    sut = new CreateChronicDiseaseUseCase(
      inMemoryChronicDiseaseRepository,
      inMemoryStorage,
    );
  });

  it('should create a chronic disease without an icon', async () => {
    const chronicDisease = makeChronicDisease();

    const result = await sut.execute(chronicDisease);

    expect(result.isRight()).toBeTruthy();
    expect(result.value.chronicDisease.name).toEqual(chronicDisease.name);
    expect(result.value.chronicDisease.description).toEqual(
      chronicDisease.description,
    );
    expect(result.value.chronicDisease.iconKey).toBeNull();
    expect(inMemoryChronicDiseaseRepository.items[0]).toEqual(
      result.value.chronicDisease,
    );
    expect(inMemoryStorage.items).toHaveLength(0);
  });

  it('should create a chronic disease with an icon', async () => {
    const file = new File(
      [
        new Blob([readFileSync('./test/storage/test-files/cd-icon.svg')], {
          type: 'image/svg+xml',
        }),
      ],
      'cd-icon.svg',
      { type: 'image/svg+xml' },
    );

    const chronicDisease = makeChronicDisease();

    const result = await sut.execute({
      name: chronicDisease.name,
      description: chronicDisease.description,
      icon: {
        fileName: file.name,
        fileType: file.type,
        buffer: Buffer.from(await file.arrayBuffer()),
      },
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.chronicDisease.name).toEqual(chronicDisease.name);
    expect(result.value.chronicDisease.description).toEqual(
      chronicDisease.description,
    );
    expect(result.value.chronicDisease.iconKey).toBeTruthy();
    expect(inMemoryChronicDiseaseRepository.items[0]).toEqual(
      result.value.chronicDisease,
    );
    expect(inMemoryStorage.items).toHaveLength(1);
  });
});
