import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { MedicineAlarm } from "@/domain/medical/enterprise/entities/medicine-alarm";
import { Injectable } from "@nestjs/common";
import { MedicineAlarmRepository } from "../../repositories/medicine-alarm-repository";

interface UpdateMedicineAlarmUseCaseRequest {
  id: UniqueEntityID;
  name?: string;
  weekdays?: Array<"sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday">;
  hours?: Array<number>;
  type?: "medicine" | "medical-consultation";
  active?: boolean;
  selfMonitorId: UniqueEntityID;
}

type UpdateMedicineAlarmUseCaseResponse = Either<
  NotAllowedError<UpdateMedicineAlarmUseCaseRequest>,
  {
    medicineAlarm: MedicineAlarm;
  }
>;

@Injectable()
export class UpdateMedicineAlarmUseCase {
  constructor (
    private medicineAlarmRepository: MedicineAlarmRepository
  ) {}

  async execute (
    data: UpdateMedicineAlarmUseCaseRequest
  ): Promise<UpdateMedicineAlarmUseCaseResponse> {
    const { id, name, weekdays, hours, type, active, selfMonitorId } = data;

    const medicineAlarm = await this.medicineAlarmRepository.findById(id, selfMonitorId);

    if (!medicineAlarm) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [{
          message: "Lembrete não encontrado",
          path: ['id']
        }]
      }));

    }

    if (name !== undefined) {
      medicineAlarm.name = name;
    }

    if (weekdays !== undefined) {
      medicineAlarm.weekdays = weekdays;
    }

    if (hours !== undefined) {
      medicineAlarm.hours = hours;
    }

    if (type !== undefined) {
      medicineAlarm.type = type;
    }

    if (active !== undefined) {
      medicineAlarm.active = active;
    }

    await this.medicineAlarmRepository.save(medicineAlarm);

    return right({
      medicineAlarm
    });
  }
}