import { InMemoryChronicDiseaseRepository } from 'test/repositories/in-memory-chronic-disease-repository';
import { UpdateChronicDiseaseUseCase } from './update-chronic-disease-use-case';
import { makeChronicDisease } from 'test/factories/make-chronic-disease';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { readFileSync } from 'node:fs';

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
    expect(response.value.chronicDisease.id).toBeTruthy();
    expect(response.value.chronicDisease.name).toEqual('new-name');
    expect(response.value.chronicDisease.description).toEqual('new-description');
    expect(inMemoryChronicDiseaseRepository.items.length).toEqual(1);
  });

  it('should be update a chronic disease with an icon', async () => {
    const chronicDisease = makeChronicDisease();

    await inMemoryChronicDiseaseRepository.create(chronicDisease);

    const icon = new File(
      [
        new Blob([
          readFileSync('./test/storage/test-files/cd-icon.svg')
        ])
      ], 
      'cd-icon.svg', 
      { type: 'image/svg+xml' }
    );

    const response = await sut.execute({
      chronicDiseaseId: chronicDisease.id.toString(),
      name: 'new-name',
      description: 'new-description',
      icon: {
        fileName: icon.name,
        fileType: icon.type,
        buffer: Buffer.from(await icon.arrayBuffer()),
      }
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDisease.id).toBeTruthy();
    expect(response.value.chronicDisease.name).toEqual('new-name');
    expect(response.value.chronicDisease.description).toEqual('new-description');
    expect(response.value.chronicDisease.iconKey).toBeTruthy();
    expect(inMemoryChronicDiseaseRepository.items.length).toEqual(1);
    expect(inMemoryStorage.items.length).toEqual(1);
  });

  it('should be delete icon if icon is null', async () => {
    const icon = new File(
      [
        new Blob([
          readFileSync('./test/storage/test-files/cd-icon.svg')
        ])
      ], 
      'cd-icon.svg', 
      { type: 'image/svg+xml' }
    );
    
    const fileKey = await inMemoryStorage.upload({
      fileName: icon.name,
      fileType: icon.type,
      buffer: Buffer.from(await icon.arrayBuffer()),
    }).then(result => result.fileKey);
    
    const chronicDisease = makeChronicDisease({
      iconKey: fileKey,
    });

    await inMemoryChronicDiseaseRepository.create(chronicDisease);

    const response = await sut.execute({
      chronicDiseaseId: chronicDisease.id.toString(),
      name: 'new-name',
      description: 'new-description',
      icon: null,
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.chronicDisease.id).toBeTruthy();
    expect(response.value.chronicDisease.iconKey).toBeNull();
    expect(inMemoryChronicDiseaseRepository.items.length).toEqual(1);
    expect(inMemoryStorage.items.length).toEqual(0);
  });

  it('should be return null if chronic disease not found', async () => {
    const response = await sut.execute({
      chronicDiseaseId: 'invalid-id',
      name: 'new-name',
      description: 'new-description',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});
