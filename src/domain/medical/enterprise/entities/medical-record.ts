import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type BloodType = 'a-' | 'a+' | 'b-' | 'b+' | 'ab-' | 'ab+' | 'o-' | 'o+';

export interface MedicalRecordProps {
  bloodType: BloodType;
  userId: string;

  createdAt: Date;
  updatedAt?: Date;
}

export class MedicalRecord extends Entity<MedicalRecordProps> {
  get bloodType () {
    return this.props.bloodType;
  }

  set bloodType (bloodType: BloodType) {
    this.props.bloodType = bloodType;
    this.update();
  }

  get userId () {
    return this.props.userId;
  }

  get createdAt () {
    return this.props.createdAt;
  }

  get updatedAt () {
    return this.props.updatedAt;
  }

  private update () {
    this.props.updatedAt = new Date();
  }

  public static create (
    props: Optional<MedicalRecordProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const medicalRecord = new MedicalRecord(
      {
        ...props,
        createdAt: new Date()
      },
      id ?? new UniqueEntityID()
    );

    return medicalRecord;
  }
}