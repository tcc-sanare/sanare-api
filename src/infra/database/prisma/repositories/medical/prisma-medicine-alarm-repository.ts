import { MedicineAlarmRepository } from "@/domain/medical/application/repositories/medicine-alarm-repository";
import { MedicineAlarm } from "@/domain/medical/enterprise/entities/medicine-alarm";
import { PrismaService } from "../../prisma.service";
import { PrismaMedicineAlarmMapper } from "../../mappers/medical/prisma-medicine-alarm-mapper";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaMedicineAlarmRepository implements MedicineAlarmRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID, selfMonitorId: UniqueEntityID): Promise<MedicineAlarm | null> {
    const medicineAlarm = await this.prisma.medicineAlarms.findFirst({
      where: {
        id: id.toString(),
        selfMonitorId: selfMonitorId.toString()
      }
    });

    if (!medicineAlarm) {
      return null;
    }

    return PrismaMedicineAlarmMapper.toDomain(medicineAlarm);
  }

  async findBySelfMonitorId(selfMonitorId: UniqueEntityID): Promise<MedicineAlarm[]> {
    const medicineAlarms = await this.prisma.medicineAlarms.findMany({
      where: {
        selfMonitorId: selfMonitorId.toString()
      }
    });

    return medicineAlarms.map(PrismaMedicineAlarmMapper.toDomain);
  }

  async create(medicineAlarm: MedicineAlarm): Promise<void> {
    const raw = PrismaMedicineAlarmMapper.toPrisma(medicineAlarm);

    await this.prisma.medicineAlarms.create({
      data: {
        ...raw,
      } as any
    });
  }

  async save(medicineAlarm: MedicineAlarm): Promise<void> {
    const raw = PrismaMedicineAlarmMapper.toPrisma(medicineAlarm);

    await this.prisma.medicineAlarms.update({
      where: {
        id: raw.id
      },
      data: {
        ...raw,
        selfMonitorId: undefined,
        selfMonitor: {
          connect: { id: raw.selfMonitorId }
        }
      } as any
    });
  }

  async delete(medicineAlarm: MedicineAlarm): Promise<void> {
    await this.prisma.medicineAlarms.delete({
      where: {
        id: medicineAlarm.id.toString()
      }
    });
  }
}