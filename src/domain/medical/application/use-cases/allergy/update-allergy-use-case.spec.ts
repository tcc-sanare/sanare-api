import { InMemoryAllergyRepository } from 'test/repositories/in-memory-allergy-repository';
import { UpdateAllergyUseCase } from './update-allergy-use-case';
import { makeAllergy } from 'test/factories/make-allergy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('UpdateAllergyUseCase', () => {
  let sut: UpdateAllergyUseCase;
  let inMemoryAllergyRepository: InMemoryAllergyRepository;

  beforeEach(() => {
    inMemoryAllergyRepository = new InMemoryAllergyRepository();
    sut = new UpdateAllergyUseCase(inMemoryAllergyRepository);
  });

  it('should be update a allergy', async () => {
    const allergy = makeAllergy();

    await inMemoryAllergyRepository.create(allergy);

    const response = await sut.execute({
      allergyId: allergy.id.toString(),
      name: 'new-name',
    });

    expect(response.isRight()).toBeTruthy();
    if (!response.isRight()) return;
    expect(response.value.allergy.id).toBeTruthy();
    expect(response.value.allergy.name).toEqual('new-name');
    expect(inMemoryAllergyRepository.items.length).toEqual(1);
  });

  it('should be return null if allergy not found', async () => {
    const response = await sut.execute({
      allergyId: 'invalid-id',
      name: 'new-name',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
