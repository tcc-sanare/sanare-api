import { InMemoryMedicalRecordRepository } from 'test/repositories/in-memory-medical-record-repository';
import { GetMedicalRecordByUserIdUseCase } from './get-medical-record-by-user-id';
import { makeMedicalRecord } from 'test/factories/make-medical-record';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';

describe('GetMedicalRecordByUserIdUseCase', () => {
  let sut: GetMedicalRecordByUserIdUseCase;
  let inMemoryMedicalRecordRepository: InMemoryMedicalRecordRepository;

  beforeEach(() => {
    inMemoryMedicalRecordRepository = new InMemoryMedicalRecordRepository();
    sut = new GetMedicalRecordByUserIdUseCase(inMemoryMedicalRecordRepository);
  });

  it('should get a medical record by user id', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      userId: medicalRecord.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.medicalRecord).toEqual(medicalRecord);
    expect(result.value.medicalRecord).toBeInstanceOf(MedicalRecord);
    expect(result.value.medicalRecord.userId.toString()).toEqual(
      medicalRecord.userId.toString(),
    );
  });

  it('should not get a medical record if it does not exist', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      userId: 'non-existing-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeNull();
  });
});
