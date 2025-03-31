import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface MedicalRecordChronicDiseaseProps {
  medicalRecordId: UniqueEntityID;
  chronicDiseaseId: UniqueEntityID;
}

export class MedicalRecordChronicDisease extends Entity<MedicalRecordChronicDiseaseProps> {
  get medicalRecordId () {
    return this.props.medicalRecordId;
  }

  get chronicDiseaseId () {
    return this.props.chronicDiseaseId;
  }

  static create (
    props: MedicalRecordChronicDiseaseProps,
    id?: UniqueEntityID
  ) {
    const medicalRecordChronicDisease = new MedicalRecordChronicDisease(
      props,
      id ?? new UniqueEntityID()
    );

    return medicalRecordChronicDisease;
  }
}