import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MedicineAlarm } from '@/domain/medical/enterprise/entities/medicine-alarm'
import { MedicineAlarms as PrismaMedicineAlarm } from '@prisma/client'

export class PrismaMedicineAlarmMapper {
  static toDomain(prismaMedicineAlarm: PrismaMedicineAlarm): MedicineAlarm {
    return MedicineAlarm.create({
      name: prismaMedicineAlarm.name,
      weekdays: prismaMedicineAlarm.weekDays,
      hours: prismaMedicineAlarm.times.map(parseInt),
      type: prismaMedicineAlarm.type as "medicine" | "medical-consultation",
      active: prismaMedicineAlarm.active,
      selfMonitorId: new UniqueEntityID(prismaMedicineAlarm.selfMonitorId),
      createdAt: prismaMedicineAlarm.createdAt,
      updatedAt: prismaMedicineAlarm.updatedAt,
    }, new UniqueEntityID(prismaMedicineAlarm.id))
  }

  static toPrisma(medicineAlarm: MedicineAlarm): PrismaMedicineAlarm {
    return {
      id: medicineAlarm.id.toString(),
      name: medicineAlarm.name,
      weekDays: medicineAlarm.weekdays,
      times: medicineAlarm.hours.map(String),
      type: medicineAlarm.type,
      active: medicineAlarm.active,
      selfMonitorId: medicineAlarm.selfMonitorId.toString(),
      createdAt: medicineAlarm.createdAt,
      updatedAt: medicineAlarm.updatedAt,
      expiresAt: null
    }
  }
}
