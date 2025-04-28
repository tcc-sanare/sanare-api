import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

type SelfMonitorLogInput = 'mood' | 'symptoms' | 'imc' | 'hydration' | 'bloodPressure' | 'bloodSugar';

export interface SelfMonitorProps {
  userId: UniqueEntityID;
  caregiverId?: UniqueEntityID;
  logInputs: Record<SelfMonitorLogInput, boolean>;

  createdAt: Date;
  updatedAt?: Date;
};

export class SelfMonitor extends Entity<SelfMonitorProps> {
  get userId() {
    return this.props.userId;
  }

  get caregiverId() {
    return this.props.caregiverId;
  }

  set caregiverId(caregiverId: UniqueEntityID) {
    this.props.caregiverId = caregiverId;
    this.update();
  }

  get logInputs() {
    return this.props.logInputs;
  }

  set logInputs(logInputs: Record<SelfMonitorLogInput, boolean>) {
    this.props.logInputs = logInputs;
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
    props: Optional<SelfMonitorProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const selfMonitor = new SelfMonitor(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityID()
    );

    return selfMonitor;
  }
}