import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AllergyProps {
  name: string;
  description?: string;

  createdAt: Date;
  updatedAt?: Date;
}

export class Allergy extends Entity<AllergyProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.update();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.update();
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
