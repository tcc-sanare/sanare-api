import { MedicalRecordAllergiesRepository } from '@/domain/medical/application/repositories/medical-record-allergy-repository';
import { MedicalRecordAllergy } from '@/domain/medical/enterprise/entities/medical-record-allergy';

export class InMemoryMedicalRecordAllergiesRepository
  implements MedicalRecordAllergiesRepository
{
  items: MedicalRecordAllergy[];

  constructor() {
    this.items = [];
  }

  async createMany(
    medicalRecordAllergies: MedicalRecordAllergy[],
  ): Promise<void> {
    this.items.push(...medicalRecordAllergies);
  }

  async deleteMany(
    medicalRecordAllergies: MedicalRecordAllergy[],
  ): Promise<void> {
    medicalRecordAllergies.forEach((medicalRecordAllergy) => {
      const medicalRecordAllergyIndex = this.items.findIndex(
        (item) =>
          item.allergyId.toString() ===
            medicalRecordAllergy.allergyId.toString() &&
          item.medicalRecordId.toString() ===
            medicalRecordAllergy.medicalRecordId.toString(),
      );

      if (medicalRecordAllergyIndex === -1) {
        return;
      }

      this.items.splice(medicalRecordAllergyIndex, 1);
    });
  }

  async findManyByMedicalRecordId(
    medicalRecordId: string,
  ): Promise<MedicalRecordAllergy[]> {
    return this.items.filter(
      (item) => item.medicalRecordId.toString() === medicalRecordId,
    );
  }

  async deleteManyByMedicalRecordId(medicalRecordId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.medicalRecordId.toString() !== medicalRecordId,
    );
  }

  async deleteManyByAllergyId(allergyId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.allergyId.toString() !== allergyId,
    );
  }
}
