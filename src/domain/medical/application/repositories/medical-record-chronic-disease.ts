import { MedicalRecordChronicDisease } from '../../enterprise/entities/medical-record-chronic-disease';

export abstract class MedicalRecordChronicDiseasesRepository {
  abstract createMany(MedicalRecordChronicDisease: MedicalRecordChronicDisease[]): Promise<void>;
  abstract deleteMany(MedicalRecordChronicDisease: MedicalRecordChronicDisease[]): Promise<void>;
  abstract findManyByMedicalRecordId(
    medicalRecordId: string,
  ): Promise<MedicalRecordChronicDisease[] | null>;
  abstract deleteManyByChronicDiseaseId(allergyId: string): Promise<void>;
}