import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ChronicDiseaseProps {
  name: string;
  description?: string;
  iconKey?: string;

  createdAt: Date;
  updatedAt?: Date;
}

export class ChronicDisease extends Entity<ChronicDiseaseProps> {
  get name () {
    return this.props.name;
  }

  set name (name: string) {
    this.props.name = name;
    this.update();
  }

  get description () {
    return this.props.description;
  }

  set description (description: string) {
    this.props.description = description;
    this.update();
  }

  get iconKey () {
    return this.props.iconKey;
  }

  set iconKey (iconKey: string) {
    this.props.iconKey = iconKey;
    this.update();
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

  public static create(
    props: Optional<ChronicDiseaseProps, 'createdAt'>,
    id?: UniqueEntityID
  ): ChronicDisease {
    return new ChronicDisease(
      {
        ...props,
        createdAt: new Date(),
      },
      id ?? new UniqueEntityID()
    );
  }
}