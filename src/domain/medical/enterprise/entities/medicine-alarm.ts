import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MedicineAlarmProps {
  name: string;
  weekdays: Array<string>;
  hours: Array<number>;
  type: "medicine" | "medical-consultation";
  active: boolean;
  selfMonitorId: UniqueEntityID;

  createdAt: Date;
  updatedAt?: Date;
}

export class MedicineAlarm extends Entity<MedicineAlarmProps> {
  get name () {
    return this.props.name;
  }

  set name (name: string) {
    this.props.name = name;
    this.update();
  }

  get weekdays () {
    return this.props.weekdays;
  }

  set weekdays (weekdays: Array<string>) {
    this.props.weekdays = weekdays;
    this.update();
  }

  get hours () {
    return this.props.hours;
  }

  set hours (hours: Array<number>) {
    this.props.hours = hours;
    this.update();
  }

  get type () {
    return this.props.type;
  }

  set type (type: "medicine" | "medical-consultation") {
    this.props.type = type;
    this.update();
  }

  get active () {
    return this.props.active;
  }

  set active (active: boolean) {
    this.props.active = active;
    this.update();
  }

  get selfMonitorId () {
    return this.props.selfMonitorId;
  }

  set selfMonitorId (selfMonitorId: UniqueEntityID) {
    this.props.selfMonitorId = selfMonitorId;
    this.update();
  }

  private update () {
    this.props.updatedAt = new Date();
  }

  get createdAt () {
    return this.props.createdAt;
  }

  get updatedAt () {
    return this.props.updatedAt;
  }

  static create (
    props: Optional<MedicineAlarmProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const { name, weekdays, hours, type, active, selfMonitorId } = props;
    return new MedicineAlarm({
      name,
      weekdays,
      hours,
      type,
      active,
      selfMonitorId,
      createdAt: props.createdAt ?? new Date()
    }, id ?? new UniqueEntityID());
  }
}