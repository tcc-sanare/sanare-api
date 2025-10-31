import { MedicineAlarm } from "@/domain/medical/enterprise/entities/medicine-alarm";

export class MedicineAlarmPresenter {
  static toHTTP (medicineAlarm: MedicineAlarm) {
    return {
      id: medicineAlarm.id.toString(),
      name: medicineAlarm.name,
      weekdays: medicineAlarm.weekdays,
      hours: medicineAlarm.hours,
      type: medicineAlarm.type,
      active: medicineAlarm.active,
      createdAt: medicineAlarm.createdAt,
      updatedAt: medicineAlarm.updatedAt
    }
  }
}