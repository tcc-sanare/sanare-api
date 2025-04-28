import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { UniqueCaregiverCode } from './value-object/unique-caregiver-code';

export interface CaregiverProps {
  code: UniqueCaregiverCode;
  userId: UniqueEntityID;

  createdAt: Date;
  updatedAt?: Date;
}

export class Caregiver extends Entity<CaregiverProps> {
  get code() {
    return this.props.code;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CaregiverProps, 'createdAt' | 'code'>,
    id?: UniqueEntityID,
  ) {
    const caregiver = new Caregiver(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        code: props.code ?? new UniqueCaregiverCode(),
      },
      id ?? new UniqueEntityID(),
    );

    return caregiver;
  }
}
