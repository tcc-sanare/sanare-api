import { MedicalRecord } from '../../enterprise/entities/medical-record';

export abstract class MedicalRecordRepository {
  abstract create(medicalRecord: MedicalRecord): Promise<void>;
  abstract save(medicalRecord: MedicalRecord): Promise<void>;
  abstract findById(id: string): Promise<MedicalRecord | null>;
  abstract findByUserId(userId: string): Promise<MedicalRecord | null>;
}
