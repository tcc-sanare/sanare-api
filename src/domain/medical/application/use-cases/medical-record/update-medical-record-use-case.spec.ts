import { InMemoryMedicalRecordRepository } from 'test/repositories/in-memory-medical-record-repository';
import { UpdateMedicalRecordUseCase } from './update-medical-record-use-case';
import { makeMedicalRecord } from 'test/factories/make-medical-record';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MedicalRecordAllergy } from '@/domain/medical/enterprise/entities/medical-record-allergy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

describe('UpdateMedicalRecordUseCase', () => {
  let sut: UpdateMedicalRecordUseCase;
  let inMemoryMedicalRecordRepository: InMemoryMedicalRecordRepository;

  beforeEach(() => {
    inMemoryMedicalRecordRepository = new InMemoryMedicalRecordRepository();
    sut = new UpdateMedicalRecordUseCase(inMemoryMedicalRecordRepository);
  });

  it('should update a medical record', async () => {
    const medicalRecord = makeMedicalRecord();
    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      medicalRecordId: medicalRecord.id.toString(),
      bloodType: 'o+',
      allergies: ['a', 'b'],
      chronicDiseases: ['c', 'd'],
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.medicalRecord.id).toEqual(medicalRecord.id);
    expect(result.value.medicalRecord.bloodType).toEqual('o+');
    expect(result.value.medicalRecord.allergies.currentItems).toEqual([
      expect.objectContaining({
        allergyId: new UniqueEntityID('a'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
      expect.objectContaining({
        allergyId: new UniqueEntityID('b'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
    ]);
    expect(result.value.medicalRecord.chronicDiseases.currentItems).toEqual([
      expect.objectContaining({
        chronicDiseaseId: new UniqueEntityID('c'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
      expect.objectContaining({
        chronicDiseaseId: new UniqueEntityID('d'),
        medicalRecordId: result.value.medicalRecord.id,
      }),
    ]);
    expect(inMemoryMedicalRecordRepository.items[0].bloodType).toEqual('o+');
    expect(
      inMemoryMedicalRecordRepository.items[0].allergies.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryMedicalRecordRepository.items[0].chronicDiseases.currentItems,
    ).toHaveLength(2);
  });

  it('should remove allergies and chronic diseases if they are not provided', async () => {
    const medicalRecord = makeMedicalRecord();
    medicalRecord.allergies.add(
      MedicalRecordAllergy.create({
        medicalRecordId: medicalRecord.id,
        allergyId: new UniqueEntityID('a'),
      }),
    );

    inMemoryMedicalRecordRepository.items.push(medicalRecord);

    const result = await sut.execute({
      medicalRecordId: medicalRecord.id.toString(),
      allergies: [],
    });

    expect(result.isRight()).toBeTruthy();
    if (!result.isRight()) return;
    expect(result.value.medicalRecord.allergies.currentItems).toHaveLength(0);
    expect(
      result.value.medicalRecord.chronicDiseases.currentItems,
    ).toHaveLength(0);
    expect(
      inMemoryMedicalRecordRepository.items[0].allergies.currentItems,
    ).toHaveLength(0);
  });

  it('should not update a medical record if it does not exist', async () => {
    const result = await sut.execute({
      medicalRecordId: 'non-existing-id',
      bloodType: 'o+',
      allergies: ['a', 'b'],
      chronicDiseases: ['c', 'd'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
