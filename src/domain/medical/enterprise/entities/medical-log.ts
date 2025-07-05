import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { MedicalLogSymptomList } from './medical-log-symptom-list';
import { MedicalLogDiseaseList } from './medical-log-disease-list';

export type MoodTypes =
  | 'calm'
  | 'happy'
  | 'energized'
  | 'angry'
  | 'low-energy'
  | 'disoriented'
  | 'discouraged'
  | 'anxious'
  | 'mood-changes';

export interface MedicalLogProps {
  bloodPressure?: string;
  heartRate?: number;
  mood?: MoodTypes;
  hydratation?: number;
  bloodSugar?: number;

  selfMonitorId: UniqueEntityID;

  symptoms: MedicalLogSymptomList;
  diseases: MedicalLogDiseaseList;

  createdAt: Date;
  updatedAt?: Date;
}

export class MedicalLog extends AggregateRoot<MedicalLogProps> {
  static create(
    props: Optional<MedicalLogProps, 'createdAt' | 'diseases' | 'symptoms'>,
    id?: UniqueEntityID,
  ) {
    const medicalLog = new MedicalLog(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        diseases: props.diseases ?? new MedicalLogDiseaseList([]),
        symptoms: props.symptoms ?? new MedicalLogSymptomList([]),
      },
      id ?? new UniqueEntityID(),
    );
    return medicalLog
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get bloodPressure() {
    return this.props.bloodPressure;
  }

  set bloodPressure(bloodPressure: string) {
    this.props.bloodPressure = bloodPressure;
    this.update();
  }

  get hearthRate() {
    return this.props.heartRate;
  }

  set hearthRate(hearthRate: number) {
    this.props.heartRate = hearthRate;
    this.update();
  }

  get mood() {
    return this.props.mood;
  }

  set mood(mood: MoodTypes) {
    this.props.mood = mood;
    this.update();
  }

  get hydratation() {
    return this.props.hydratation;
  }

  set hydratation(hydratation: number) {
    this.props.hydratation = hydratation;
    this.update();
  }

  get bloodSugar() {
    return this.props.bloodSugar;
  }

  set bloodSugar(bloodSugar: number) {
    this.props.bloodSugar = bloodSugar;
    this.update();
  }

  get diseases() {
    return this.props.diseases;
  }

  set diseases(diseases: MedicalLogDiseaseList) {
    this.props.diseases = diseases;
    this.update();
  }

  get symptoms() {
    return this.props.symptoms;
  }

  set symptoms(symptoms: MedicalLogSymptomList) {
    this.props.symptoms = symptoms;
    this.update();
  }

  get selfMonitorId() {
    return this.props.selfMonitorId
  }
}
