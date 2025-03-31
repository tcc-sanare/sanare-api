import { MedicalRecordAllergy } from '../../enterprise/entities/medical-record-allergy';

export abstract class MedicalRecordAllergiesRepository {
  abstract createMany(MedicalRecordAllergy: MedicalRecordAllergy[]): Promise<void>;
  abstract deleteMany(MedicalRecordAllergy: MedicalRecordAllergy[]): Promise<void>;
  abstract findManyByMedicalRecordId(
    medicalRecordId: string,
  ): Promise<MedicalRecordAllergy[] | null>;
  abstract deleteManyByAllergyId(allergyId: string): Promise<void>;
}