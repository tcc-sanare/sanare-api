import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { MedicalRecordAllergyList } from './medical-record-allergy-list';
import { MedicalRecordChronicDiseaseList } from './medical-record-chronic-disease-list';

export type BloodType = 'a-' | 'a+' | 'b-' | 'b+' | 'ab-' | 'ab+' | 'o-' | 'o+';

export interface MedicalRecordProps {
  bloodType: BloodType;
  userId: UniqueEntityID;

  allergies: MedicalRecordAllergyList;
  chronicDiseases: MedicalRecordChronicDiseaseList;

  createdAt: Date;
  updatedAt?: Date;
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {
  get bloodType() {
    return this.props.bloodType;
  }

  set bloodType(bloodType: BloodType) {
    this.props.bloodType = bloodType;
    this.update();
  }

  get userId() {
    return this.props.userId;
  }

  get allergies() {
    return this.props.allergies;
  }

  set allergies(allergies: MedicalRecordAllergyList) {
    this.props.allergies = allergies;
    this.update();
  }

  get chronicDiseases() {
    return this.props.chronicDiseases;
  }

  set chronicDiseases(chronicDiseases: MedicalRecordChronicDiseaseList) {
    this.props.chronicDiseases = chronicDiseases;
    this.update();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Optional<
      MedicalRecordProps,
      'createdAt' | 'allergies' | 'chronicDiseases'
    >,
    id?: UniqueEntityID,
  ) {
    const medicalRecord = new MedicalRecord(
      {
        ...props,
        createdAt: new Date(),
        allergies: props.allergies ?? new MedicalRecordAllergyList([]),
        chronicDiseases:
          props.chronicDiseases ?? new MedicalRecordChronicDiseaseList([]),
      },
      id ?? new UniqueEntityID(),
    );

    return medicalRecord;
  }
}
