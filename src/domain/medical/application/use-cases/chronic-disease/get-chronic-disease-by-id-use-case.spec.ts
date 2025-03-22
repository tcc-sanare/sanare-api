import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { GetChronicDiseaseByIdUseCase } from './get-chronic-disease-by-id-use-case';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';

describe('GetChronicDiseaseByIdUseCase', () => {
  let sut: GetChronicDiseaseByIdUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    sut = new GetChronicDiseaseByIdUseCase(inMemoryChronicDiseaseRepository);
  });

  it('should be return a chronic disease', async () => {
    const chronicDisease = makeChronicDisease();

    await inMemoryChronicDiseaseRepository.create(chronicDisease);

    const response = await sut.execute({ chronicDiseaseId: chronicDisease.id.toString() });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDisease.id).toEqual(chronicDisease.id);
    expect(response.value.chronicDisease.name).toEqual(chronicDisease.name);
    expect(response.value.chronicDisease.description).toEqual(chronicDisease.description);
  });

  it('should be return null if chronic disease not found', async () => {
    const response = await sut.execute({ chronicDiseaseId: 'invalid-id' });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});
