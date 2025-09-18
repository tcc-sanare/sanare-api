import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { MedicineAlarm } from "@/domain/medical/enterprise/entities/medicine-alarm";
import { Injectable } from "@nestjs/common";
import { MedicineAlarmRepository } from "../../repositories/medicine-alarm-repository";

interface GetMedicineAlarmByIdUseCaseRequest {
  id: UniqueEntityID;
  selfMonitorId: UniqueEntityID;
}

type GetMedicineAlarmByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetMedicineAlarmByIdUseCaseRequest>,
  {
    medicineAlarm: MedicineAlarm;
  }
>;

@Injectable()
export class GetMedicineAlarmByIdUseCase {
  constructor (
    private medicineAlarmRepository: MedicineAlarmRepository
  ) {}

  async execute ({
    id,
    selfMonitorId 
  }: GetMedicineAlarmByIdUseCaseRequest): Promise<GetMedicineAlarmByIdUseCaseResponse> {
    const medicineAlarm = await this.medicineAlarmRepository.findById(id, selfMonitorId);

    if (!medicineAlarm) {
      return left(new ResourceNotFoundError({
        errors: [{
          message: "Lembrete não encontrado",
          path: ['id']
        }]
      }));
    }

    return right({
      medicineAlarm
    });
  }
}