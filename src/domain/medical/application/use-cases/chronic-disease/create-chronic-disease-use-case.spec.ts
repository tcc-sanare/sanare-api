import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { CreateChronicDiseaseUseCase } from './create-chronic-disease-use-case';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';

describe('CreateChronicDiseaseUseCase', () => {
  let sut: CreateChronicDiseaseUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    sut = new CreateChronicDiseaseUseCase(
      inMemoryChronicDiseaseRepository,
    );
  });

  it('should create a chronic disease', async () => {
    const chronicDisease = makeChronicDisease();

    const result = await sut.execute(chronicDisease);

    expect(result.isRight()).toBeTruthy();
    expect(result.value.chronicDisease.name).toEqual(chronicDisease.name);
    expect(result.value.chronicDisease.description).toEqual(
      chronicDisease.description,
    );
    expect(inMemoryChronicDiseaseRepository.items[0]).toEqual(
      result.value.chronicDisease,
    );
  });
});
