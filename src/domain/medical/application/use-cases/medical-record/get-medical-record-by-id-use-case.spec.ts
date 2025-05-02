import { InMemoryMedicalRecordRepository } from 'test/repositories/in-memory-medical-record-repository';
import { GetMedicalRecordByIdUseCase } from './get-medical-record-by-id-use-case';
import { makeMedicalRecord } from 'test/factories/make-medical-record';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

describe('GetMedicalRecordUseCase', () => {
  let sut: GetMedicalRecordByIdUseCase;
  let inMemoryMedicalRecordRepository: InMemoryMedicalRecordRepository;

  beforeEach(() => {
    inMemoryMedicalRecordRepository = new InMemoryMedicalRecordRepository();
    sut = new GetMedicalRecordByIdUseCase(inMemoryMedicalRecordRepository);
  });

  it('should get a medical record by id', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      medicalRecordId: medicalRecord.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.medicalRecord).toEqual(medicalRecord);
    expect(result.value.medicalRecord).toBeInstanceOf(MedicalRecord);
  });

  it('should not get a medical record if it does not exist', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      medicalRecordId: 'non-existing-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
