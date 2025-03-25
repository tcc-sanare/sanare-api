import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface MedicalRecordAllergyProps {
  allergyId: UniqueEntityID;
  medicalRecordId: UniqueEntityID;
}

export class MedicalRecordAllergy extends Entity<MedicalRecordAllergyProps> {
  get allergyId(): UniqueEntityID {
    return this.props.allergyId;
  }
  get medicalRecordId() {
    return this.props.medicalRecordId;
  }

  static create(props: MedicalRecordAllergyProps, id?: UniqueEntityID) {
    const medicalRecordAllergy = new MedicalRecordAllergy(props, id);

    return medicalRecordAllergy;
  }
}