import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { MedicineAlarmRepository } from "../../repositories/medicine-alarm-repository";

interface DeleteMedicineAlarmUseCaseRequest {
  id: UniqueEntityID;
  selfMonitorId: UniqueEntityID;
}

type DeleteMedicineAlarmUseCaseResponse = Either<
  NotAllowedError<DeleteMedicineAlarmUseCaseRequest>,
  {}
>;

@Injectable()
export class DeleteMedicineAlarmUseCase {
  constructor (
    private medicineAlarmRepository: MedicineAlarmRepository
  ) {}

  async execute ({
    id,
    selfMonitorId
  }: DeleteMedicineAlarmUseCaseRequest): Promise<DeleteMedicineAlarmUseCaseResponse> {
    const medicineAlarm = await this.medicineAlarmRepository.findById(id, selfMonitorId);

    if (!medicineAlarm) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [{
          message: "Lembrete não encontrado",
          path: ["id"]
        }]
      }))
    }

    await this.medicineAlarmRepository.delete(medicineAlarm);

    return right({});
  }
}