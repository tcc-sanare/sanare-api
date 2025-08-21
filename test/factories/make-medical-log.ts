import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  MedicalLog,
  MedicalLogProps,
  MoodTypes,
} from '@/domain/medical/enterprise/entities/medical-log';
import { faker } from '@faker-js/faker';

const moodTypes: MoodTypes[] = [
  'calm',
  'happy',
  'energized',
  'angry',
  'low energy',
  'disoriented',
  'discouraged',
  'anxious',
  'humor changes',
];

export function makeMedicalLog(
  override?: Partial<MedicalLogProps>,
  id?: UniqueEntityID,
) {
  const medicalLog = MedicalLog.create({
    bloodPressure: `${faker.number.int({ min: 90, max: 120 })}/${faker.number.int({ min: 60, max: 80 })}`,
    heartRate: faker.number.int({min: 60, max: 100}),
    mood: moodTypes.sort(() => Math.floor(Math.random() *1 ? -1 : 1))[0],
    hydratation: faker.number.int({min: 2, max: 6}),
    bloodSugar: faker.number.int({min: 70, max: 99}),
    selfMonitorId: new UniqueEntityID(),

    ...override
  }, id);

  return medicalLog
}
