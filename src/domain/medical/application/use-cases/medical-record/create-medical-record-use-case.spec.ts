import { InMemoryMedicalRecordAllergiesRepository } from "test/repositories/in-memory-medical-record-allergy-repository";
import { InMemoryMedicalRecordChronicDiseasesRepository } from "test/repositories/in-memory-medical-record-chronic-disease-repository";
import { InMemoryMedicalRecordRepository } from "test/repositories/in-memory-medical-record-repository";
import { CreateMedicalRecordUseCase } from "./create-medical-record-use-case";
import { makeMedicalRecord } from "test/factories/make-medical-record";

describe("CreateMedicalRecordUseCase", () => {
  let sut: CreateMedicalRecordUseCase;

  let inMemoryMedicalRecordRepository: InMemoryMedicalRecordRepository;
  let inMemoryMedicalRecordAllergiesRepository: InMemoryMedicalRecordAllergiesRepository;
  let inMemoryMedicalRecordChronicDiseasesRepository: InMemoryMedicalRecordChronicDiseasesRepository;

  beforeEach(() => {
    inMemoryMedicalRecordRepository = new InMemoryMedicalRecordRepository();
    inMemoryMedicalRecordAllergiesRepository = new InMemoryMedicalRecordAllergiesRepository();
    inMemoryMedicalRecordChronicDiseasesRepository = new InMemoryMedicalRecordChronicDiseasesRepository();

    sut = new CreateMedicalRecordUseCase (
      inMemoryMedicalRecordRepository,
      inMemoryMedicalRecordAllergiesRepository,
      inMemoryMedicalRecordChronicDiseasesRepository
    );

  })

  it('should create a Medical Record', async () => {
    const medicalRecord = makeMedicalRecord();
    const result = await sut.execute({
      userId: medicalRecord.userId.toString(),
      bloodType: medicalRecord.bloodType,
      allergies: [],
      chronicDiseases: []
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.medicalRecord.id).toEqual(medicalRecord.id);
    expect(inMemoryMedicalRecordRepository.items[0].id.toString()).toEqual(result.value.medicalRecord.id.toString());
    expect(inMemoryMedicalRecordRepository.items[0].bloodType).toEqual(medicalRecord.bloodType);

  })

})