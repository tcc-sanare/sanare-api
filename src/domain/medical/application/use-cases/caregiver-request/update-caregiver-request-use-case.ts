import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";
import { GetSelfMonitorByIdUseCase } from "../self-monitor/get-self-monitor-by-id-use-case";
import { UpdateSelfMonitorUseCase } from "../self-monitor/update-self-monitor-use-case";

interface UpdateCaregiverRequestUseCaseRequest {
  caregiverRequestId: UniqueEntityID;
  status: "accepted" | "rejected";
}

type UpdateCaregiverRequestUseCaseResponse = Either<
  NotAllowedError<UpdateCaregiverRequestUseCaseRequest>,
  {
    caregiverRequest: CaregiverRequest;
  }
>;

@Injectable()
export class UpdateCaregiverRequestUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
    private getSelfMonitorByIdUseCase: GetSelfMonitorByIdUseCase,
    private updateSelfMonitorUseCase: UpdateSelfMonitorUseCase,
  ) {}

  async execute(
    request: UpdateCaregiverRequestUseCaseRequest,
  ): Promise<UpdateCaregiverRequestUseCaseResponse> {
    const { caregiverRequestId, status } = request;

    // Fetch the existing caregiver request
    const caregiverRequest = await this.caregiverRequestRepository.findById(caregiverRequestId.toString());
    if (!caregiverRequest) {
      return left(new NotAllowedError({
        statusCode: 404,
        errors: [
          {
            message: "Caregiver request not found.",
          },
        ],
      }));
    }

    caregiverRequest.status = status;

    if (status === "accepted") {
      const selfMonitor = await this.getSelfMonitorByIdUseCase.execute({
        selfMonitorId: caregiverRequest.caregiverId.toString(),
      }).then(result => {
        if (result.isLeft()) {
          return left(new NotAllowedError({
            statusCode: 404,
            errors: [
              {
                message: "Caregiver not found.",
              },
            ],
          }));
        }
        return result.value.selfMonitor;
      });

      await this.updateSelfMonitorUseCase.execute({
        selfMonitorId: caregiverRequest.selfMonitorId,
        caregiverId: caregiverRequest.caregiverId,
      }).then(result => {
        if (result.isLeft()) {
          return left(result.value);
        }

        return right(result.value.selfMonitor);
      });
    }

    await this.caregiverRequestRepository.save(caregiverRequest);

    return right({
      caregiverRequest,
    });
  }
}