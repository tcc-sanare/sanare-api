import { MedicalRecordRepository } from "@/domain/medical/application/repositories/medical-record-repository";
import { MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";

export class InMemoryMedicalRecordRepository implements MedicalRecordRepository {
  items: MedicalRecord[]

  constructor () {
    this.items = [];
  }
  
  async create(medicalRecord: MedicalRecord): Promise<void> {
    console.log(medicalRecord.id.toString())
    this.items.push(medicalRecord);
  }

  async save(medicalRecord: MedicalRecord): Promise<void> {
    const medicalRecordIndex = this.items.findIndex(item => item.id.toString() === medicalRecord.id.toString());

    if (medicalRecordIndex === -1) {
      return null;
    }

    this.items[medicalRecordIndex] = medicalRecord;
  }

  async findById(id: string): Promise<MedicalRecord> {
    return this.items.find(item => item.id.toString() === id);
  }

  async findByUserId(userId: string): Promise<MedicalRecord> {
    return this.items.find(item => item.userId.toString() === userId);
  }
  
}