import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { GetChronicDiseasesByNameUseCase } from './get-chronic-diseases-by-name-use-case';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';

describe('GetChronicDiseasesByNameUseCase', () => {
  let sut: GetChronicDiseasesByNameUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    sut = new GetChronicDiseasesByNameUseCase(inMemoryChronicDiseaseRepository);
  });

  it('should be return one chronic disease', async () => {
    const chronicDisease = makeChronicDisease();
    const chronicDisease2 = makeChronicDisease({
      name: 'another-name',
    });

    await inMemoryChronicDiseaseRepository.create(chronicDisease);
    await inMemoryChronicDiseaseRepository.create(chronicDisease2);

    const response = await sut.execute({ name: chronicDisease.name.substring(0, 3) });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDiseases.length).toEqual(1);
    expect(response.value.chronicDiseases[0].id).toEqual(chronicDisease.id);
  });

  it('should be return two chronic diseases', async () => {
    const chronicDisease = makeChronicDisease();
    const chronicDisease2 = makeChronicDisease({
      name: chronicDisease.name.substring(0, chronicDisease.name.length - 1),
    });

    await inMemoryChronicDiseaseRepository.create(chronicDisease);
    await inMemoryChronicDiseaseRepository.create(chronicDisease2);

    const response = await sut.execute({ name: chronicDisease.name.substring(0, 3) });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDiseases.length).toEqual(2);
    expect(response.value.chronicDiseases[0].id).toEqual(chronicDisease.id);
    expect(response.value.chronicDiseases[1].id).toEqual(chronicDisease2.id);
  });

  it('should be return an empty array if no chronic disease is found', async () => {
    const response = await sut.execute({ name: 'invalid-name' });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDiseases).toHaveLength(0);
  });
});
