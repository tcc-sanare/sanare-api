import { InMemoryMedicalRecordRepository } from 'test/repositories/in-memory-medical-record-repository';
import { CreateMedicalRecordUseCase } from './create-medical-record-use-case';
import { makeMedicalRecord } from 'test/factories/make-medical-record';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('CreateMedicalRecordUseCase', () => {
  let sut: CreateMedicalRecordUseCase;

  let inMemoryMedicalRecordRepository: InMemoryMedicalRecordRepository;

  beforeEach(() => {
    inMemoryMedicalRecordRepository = new InMemoryMedicalRecordRepository();

    sut = new CreateMedicalRecordUseCase(inMemoryMedicalRecordRepository);
  });

  it('should create a Medical Record', async () => {
    const medicalRecord = makeMedicalRecord();
    const result = await sut.execute({
      selfMonitorId: medicalRecord.selfMonitorId.toString(),
      bloodType: medicalRecord.bloodType,
      allergies: [
        {
          allergyId: 'a'
        },
        {
          allergyId: 'c',
          description: 'description c'
        }
      ],
      chronicDiseases: ['b', 'd'],
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.medicalRecord.id).toBeTruthy();
    expect(result.value.medicalRecord.selfMonitorId.toString()).toEqual(
      medicalRecord.selfMonitorId.toString(),
    );
    expect(result.value.medicalRecord.allergies.currentItems).toEqual([
      expect.objectContaining({
        allergyId: new UniqueEntityID('a'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
      expect.objectContaining({
        allergyId: new UniqueEntityID('c'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
    ]);
    expect(result.value.medicalRecord.chronicDiseases.currentItems).toEqual([
      expect.objectContaining({
        chronicDiseaseId: new UniqueEntityID('b'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
      expect.objectContaining({
        chronicDiseaseId: new UniqueEntityID('d'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
    ]);
    expect(inMemoryMedicalRecordRepository.items[0].id.toString()).toEqual(
      result.value.medicalRecord.id.toString(),
    );
    expect(inMemoryMedicalRecordRepository.items[0].bloodType).toEqual(
      medicalRecord.bloodType,
    );
  });

  it('should not create a Medical Record if an error occurs', async () => {
    const medicalRecord = makeMedicalRecord();

    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      selfMonitorId: medicalRecord.selfMonitorId.toString(),
      bloodType: medicalRecord.bloodType,
      allergies: [
        {
          allergyId: 'a'
        },
        {
          allergyId: 'b',
          description: 'description b'
        }
      ],
      chronicDiseases: ['b', 'd'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryMedicalRecordRepository.items.length).toEqual(1);
  });
});
