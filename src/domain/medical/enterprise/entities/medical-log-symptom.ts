import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface MedicalLogSymptomProps {
  medicalLogId: UniqueEntityID;
  symptomId: UniqueEntityID;
}

export class MedicalLogSymptom extends Entity<MedicalLogSymptomProps> {
  static create(props: MedicalLogSymptomProps, id?: UniqueEntityID) {
    const medicalLogSymptom = new MedicalLogSymptom(
      props,
      id ?? new UniqueEntityID(),
    );
    return medicalLogSymptom
  }

  get medicalLogId() {
    return this.props.medicalLogId;
  }

  get symptomId() {
    return this.props.symptomId;
  }
}
