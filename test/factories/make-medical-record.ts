import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  BloodType,
  MedicalRecord,
  MedicalRecordProps,
} from '@/domain/medical/enterprise/entities/medical-record';

const bloodTypes: BloodType[] = [
  'a-',
  'b-',
  'ab-',
  'o-',
  'a+',
  'b+',
  'ab+',
  'o+',
];

export function makeMedicalRecord(props?: Partial<MedicalRecordProps>) {
  const medicalRecord = MedicalRecord.create({
    bloodType: bloodTypes.sort(() => Math.floor(Math.random() * 1 ? -1 : 1))[0],
    userId: new UniqueEntityID(),
    ...props,
  });

  return medicalRecord;
}
