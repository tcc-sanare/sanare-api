import { MedicalRecordChronicDiseasesRepository } from "@/domain/medical/application/repositories/medical-record-chronic-disease-repository";
import { MedicalRecordChronicDisease } from "@/domain/medical/enterprise/entities/medical-record-chronic-disease";

export class InMemoryMedicalRecordChronicDiseasesRepository implements MedicalRecordChronicDiseasesRepository {

  items: MedicalRecordChronicDisease[]

  constructor () {
    this.items = [];
  }

  async createMany(medicalRecordChronicDiseases: MedicalRecordChronicDisease[]): Promise<void> {
    this.items.push(...medicalRecordChronicDiseases);
  }

  async deleteMany(medicalRecordChronicDiseases: MedicalRecordChronicDisease[]): Promise<void> {
    medicalRecordChronicDiseases.forEach(medicalRecordChronicMedicalRecordChronicDisease => {
      const medicalRecordChronicMedicalRecordChronicDiseaseIndex = this.items
        .findIndex(item => item.chronicDiseaseId.toString() === medicalRecordChronicMedicalRecordChronicDisease.chronicDiseaseId.toString() && item.medicalRecordId.toString() === medicalRecordChronicMedicalRecordChronicDisease.medicalRecordId.toString());

      if (medicalRecordChronicMedicalRecordChronicDiseaseIndex === -1) {
        return;
      }

      this.items.splice(medicalRecordChronicMedicalRecordChronicDiseaseIndex, 1);
    });
  }

  async findManyByMedicalRecordId(medicalRecordId: string): Promise<MedicalRecordChronicDisease[]> {
    return this.items.filter(item => item.medicalRecordId.toString() === medicalRecordId);
  }

  async deleteManyByMedicalRecordId(medicalRecordId: string): Promise<void> {
    this.items = this.items.filter(item => item.medicalRecordId.toString() !== medicalRecordId);
  }

  async deleteManyByChronicDiseaseId(chronicDiseaseId: string): Promise<void> {
    this.items = this.items.filter(item => item.chronicDiseaseId.toString() !== chronicDiseaseId);
  }
  
}