import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
  title: string;
  body: string;
  accountId: UniqueEntityID;
  data: Record<string, any>;
  
  createdAt: Date;
  updatedAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
  get title() {
    return this.props.title;
  }

  get body() {
    return this.props.body;
  }

  get data() {
    return this.props.data;
  }

  get accountId() {
    return this.props.accountId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<NotificationProps, "createdAt">, id?: UniqueEntityID) {
    return new Notification({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id ?? new UniqueEntityID());
  }
}