import { WatchedList } from '@/core/entities/watched-list';
import { MedicalRecordAllergy } from './medical-record-allergy';

export class MedicalRecordAllergyList extends WatchedList<MedicalRecordAllergy> {
  compareItems(a: MedicalRecordAllergy, b: MedicalRecordAllergy): boolean {
    return a.allergyId.equals(b.allergyId);
  }
}