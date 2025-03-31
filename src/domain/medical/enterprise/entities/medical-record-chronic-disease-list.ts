import { WatchedList } from '@/core/entities/watched-list';
import { MedicalRecordChronicDisease } from './medical-record-chronic-disease';

export class MedicalRecordChronicDiseaseList extends WatchedList<MedicalRecordChronicDisease> {
  compareItems(a: MedicalRecordChronicDisease, b: MedicalRecordChronicDisease): boolean {
    return a.chronicDiseaseId.equals(b.chronicDiseaseId);
  }
}