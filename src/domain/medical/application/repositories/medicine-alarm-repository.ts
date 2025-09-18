import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { MedicineAlarm } from "../../enterprise/entities/medicine-alarm";

export abstract class MedicineAlarmRepository {
  abstract findBySelfMonitorId (selfMonitorId: UniqueEntityID): Promise<Array<MedicineAlarm>>;
  abstract findById (id: UniqueEntityID, selfMonitorId: UniqueEntityID): Promise<MedicineAlarm | null>;
  abstract create (medicineAlarm: MedicineAlarm): Promise<void>;
  abstract save (medicineAlarm: MedicineAlarm): Promise<void>;
  abstract delete (medicineAlarm: MedicineAlarm): Promise<void>;
}