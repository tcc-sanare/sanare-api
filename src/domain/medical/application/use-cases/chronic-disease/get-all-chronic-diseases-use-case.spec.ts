import { makeChronicDisease } from 'test/factories/make-chronic-disease';
import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { GetAllChronicDiseasesUseCase } from './get-all-chronic-diseases-use-case';

describe('GetAllChronicDiseasesUseCase', () => {
  let sut: GetAllChronicDiseasesUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    sut = new GetAllChronicDiseasesUseCase(inMemoryChronicDiseaseRepository);
  });

  it('should return all chronic diseases', async () => {
    for (let i = 0; i < 3; i++) {
      await inMemoryChronicDiseaseRepository.create(makeChronicDisease());
    }

    const response = await sut.execute();

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDiseases).toHaveLength(3);
  });

  it('should return an empty array if there are no chronic diseases', async () => {
    const response = await sut.execute();

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDiseases).toHaveLength(0);
  });
});
