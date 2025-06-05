import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AllergyProps {
  name: string;
  type: 'antibiotic' | 'anti-inflammatory' | 'analgesic' | 'anticonvulsant';

  createdAt: Date;
  updatedAt?: Date;
}

export type AllergyType = AllergyProps['type'];

export class Allergy extends Entity<AllergyProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.update();
  }

  get type() {
    return this.props.type;
  }

  set type(type: AllergyType) {
    this.props.type = type;
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

  static create(
    props: Optional<AllergyProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const allergy = new Allergy(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityID(),
    );

    return allergy;
  }
}
