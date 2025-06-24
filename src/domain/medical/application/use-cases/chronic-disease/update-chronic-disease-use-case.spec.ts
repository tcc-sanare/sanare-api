import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { UpdateChronicDiseaseUseCase } from './update-chronic-disease-use-case';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { readFileSync } from 'node:fs';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('UpdateChronicDiseaseUseCase', () => {
  let sut: UpdateChronicDiseaseUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;
  let inMemoryStorage: InMemoryStorage;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    inMemoryStorage = new InMemoryStorage();
    sut = new UpdateChronicDiseaseUseCase(
      inMemoryChronicDiseaseRepository,
      inMemoryStorage,
    );
  });

  it('should be update a chronic disease without an icon', async () => {
    const chronicDisease = makeChronicDisease();

    await inMemoryChronicDiseaseRepository.create(chronicDisease);

    const response = await sut.execute({
      chronicDiseaseId: chronicDisease.id.toString(),
      name: 'new-name',
      description: 'new-description',
    });

    expect(response.isRight()).toBeTruthy();
    if (!response.isRight()) return;
    expect(response.value.chronicDisease.id).toBeTruthy();
    expect(response.value.chronicDisease.name).toEqual('new-name');
    expect(response.value.chronicDisease.description).toEqual(
      'new-description',
    );
    expect(inMemoryChronicDiseaseRepository.items.length).toEqual(1);
  });

  it('should be return null if chronic disease not found', async () => {
    const response = await sut.execute({
      chronicDiseaseId: 'invalid-id',
      name: 'new-name',
      description: 'new-description',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
