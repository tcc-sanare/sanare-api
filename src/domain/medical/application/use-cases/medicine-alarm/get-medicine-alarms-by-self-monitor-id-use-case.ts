import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { MedicineAlarm } from "@/domain/medical/enterprise/entities/medicine-alarm";
import { Injectable } from "@nestjs/common";
import { MedicineAlarmRepository } from "../../repositories/medicine-alarm-repository";

interface GetMedicineAlarmsBySelfMonitorIdUseCaseRequest {
  selfMonitorId: UniqueEntityID;
}

type GetMedicineAlarmsBySelfMonitorIdUseCaseResponse = Either<
  null,
  {
    medicineAlarms: MedicineAlarm[];
  }
>;

@Injectable()
export class GetMedicineAlarmsBySelfMonitorIdUseCase {
  constructor (
    private medicineAlarmRepository: MedicineAlarmRepository
  ) {}

  async execute (
    {
      selfMonitorId
    }: GetMedicineAlarmsBySelfMonitorIdUseCaseRequest
  ): Promise<GetMedicineAlarmsBySelfMonitorIdUseCaseResponse> {
    const medicineAlarms = await this.medicineAlarmRepository.findBySelfMonitorId(selfMonitorId);

    return right({
      medicineAlarms
    });
  }
}