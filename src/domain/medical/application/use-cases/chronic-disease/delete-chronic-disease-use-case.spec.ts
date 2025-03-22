import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { DeleteChronicDiseaseUseCase } from './delete-chronic-disease-use-case';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';

describe('DeleteChronicDiseaseUseCase', () => {
  let sut: DeleteChronicDiseaseUseCase;
  let inMemoryChronicDiseaseRepository: InMemoryChronicDiseaseRepository;

  beforeEach(() => {
    inMemoryChronicDiseaseRepository = new InMemoryChronicDiseaseRepository();
    sut = new DeleteChronicDiseaseUseCase(inMemoryChronicDiseaseRepository);
  });

  it('should be delete a chronic disease', async () => {
    const chronicDisease = makeChronicDisease();

    await inMemoryChronicDiseaseRepository.create(chronicDisease);

    const response = await sut.execute({
      chronicDiseaseId: chronicDisease.id.toString(),
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDisease.id).toEqual(chronicDisease.id);
    expect(inMemoryChronicDiseaseRepository.items.length).toEqual(0);
  });

  it('should be return null if chronic disease not found', async () => {
    const response = await sut.execute({
      chronicDiseaseId: 'invalid-id',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});
