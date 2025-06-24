import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CaregiverRequestProps {
  caregiverId: UniqueEntityID;
  selfMonitorId: UniqueEntityID;

  createdAt: Date;
  updatedAt?: Date;
}

export class CaregiverRequest extends Entity<CaregiverRequestProps> {
  get caregiverId(): UniqueEntityID {
    return this.props.caregiverId;
  }

  get selfMonitorId(): UniqueEntityID {
    return this.props.selfMonitorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: Optional<CaregiverRequestProps, "createdAt">, id?: UniqueEntityID): CaregiverRequest {
    return new CaregiverRequest({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);
  }
}