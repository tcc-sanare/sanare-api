import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface DeviceProps {
  token: string;
  userId: UniqueEntityID;

  createdAt: Date;
  updatedAt?: Date;
}

export class Device extends Entity<DeviceProps> {
  get token() {
    return this.props.token;
  }

  get userId() {
    return this.props.userId;
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId;
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
    props: Optional<DeviceProps, "createdAt">,
    id?: UniqueEntityID
  ): Device {
    const device = new Device(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityID()
    );

    return device;
  }
}
