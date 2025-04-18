import { MedicalRecordAllergy } from '../../enterprise/entities/medical-record-allergy';

export abstract class MedicalRecordAllergiesRepository {
  abstract createMany(
    medicalRecordAllergies: MedicalRecordAllergy[],
  ): Promise<void>;
  abstract deleteMany(
    medicalRecordAllergies: MedicalRecordAllergy[],
  ): Promise<void>;
  abstract findManyByMedicalRecordId(
    medicalRecordId: string,
  ): Promise<MedicalRecordAllergy[] | null>;
  abstract deleteManyByMedicalRecordId(medicalRecordId: string): Promise<void>;
  abstract deleteManyByAllergyId(allergyId: string): Promise<void>;
}
