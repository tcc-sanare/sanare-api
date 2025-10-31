import { Either, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { MedicineAlarm } from "@/domain/medical/enterprise/entities/medicine-alarm";
import { Injectable } from "@nestjs/common";
import { MedicineAlarmRepository } from "../../repositories/medicine-alarm-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateMedicineAlarmUseCaseRequest {
  name: string;
  weekdays: Array<"sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday">;
  hours: Array<number>;
  type: "medicine" | "medical-consultation";
  active: boolean;
  selfMonitorId: UniqueEntityID;
}

type CreateMedicineAlarmUseCaseResponse = Either<
  NotAllowedError<CreateMedicineAlarmUseCaseRequest>,
  {
    medicineAlarm: MedicineAlarm;
  }
>;

@Injectable()
export class CreateMedicineAlarmUseCase {
  constructor (
    private medicineAlarmRepository: MedicineAlarmRepository
  ) {}

  async execute (
    data: CreateMedicineAlarmUseCaseRequest
  ): Promise<CreateMedicineAlarmUseCaseResponse> {
    const { name, weekdays, hours, type, active, selfMonitorId } = data;

    const medicineAlarm = MedicineAlarm.create({
      name,
      weekdays,
      hours,
      type,
      active,
      selfMonitorId
    });

    await this.medicineAlarmRepository.create(medicineAlarm);

    return right({
      medicineAlarm
    });
  }
}