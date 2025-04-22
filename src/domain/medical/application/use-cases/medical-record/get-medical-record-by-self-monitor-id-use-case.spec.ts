import { InMemoryMedicalRecordRepository } from 'test/repositories/in-memory-medical-record-repository';
import { GetMedicalRecordBySelfMonitorIdUseCase } from './get-medical-record-by-self-monitor-id';
import { makeMedicalRecord } from 'test/factories/make-medical-record';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';

describe('GetMedicalRecordBySelfMonitorIdUseCase', () => {
  let sut: GetMedicalRecordBySelfMonitorIdUseCase;
  let inMemoryMedicalRecordRepository: InMemoryMedicalRecordRepository;

  beforeEach(() => {
    inMemoryMedicalRecordRepository = new InMemoryMedicalRecordRepository();
    sut = new GetMedicalRecordBySelfMonitorIdUseCase(inMemoryMedicalRecordRepository);
  });

  it('should get a medical record by user id', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      selfMonitorId: medicalRecord.selfMonitorId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.medicalRecord).toEqual(medicalRecord);
    expect(result.value.medicalRecord).toBeInstanceOf(MedicalRecord);
    expect(result.value.medicalRecord.selfMonitorId.toString()).toEqual(
      medicalRecord.selfMonitorId.toString(),
    );
  });

  it('should not get a medical record if it does not exist', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      selfMonitorId: 'non-existing-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeNull();
  });
});
