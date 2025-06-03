import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface MedicalRecordAllergyProps {
  allergyId: UniqueEntityID;
  medicalRecordId: UniqueEntityID;
  description?: string;
}

export class MedicalRecordAllergy extends Entity<MedicalRecordAllergyProps> {
  get allergyId(): UniqueEntityID {
    return this.props.allergyId;
  }

  get medicalRecordId() {
    return this.props.medicalRecordId;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string | null) {
    this.props.description = description;
  }

  static create(props: MedicalRecordAllergyProps, id?: UniqueEntityID) {
    const medicalRecordAllergy = new MedicalRecordAllergy(props, id);

    return medicalRecordAllergy;
  }
}
