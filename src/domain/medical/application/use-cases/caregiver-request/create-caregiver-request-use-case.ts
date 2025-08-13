import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";

interface CreateCaregiverRequestUseCaseRequest {
  caregiverId: UniqueEntityID;
  selfMonitorId: UniqueEntityID;
}

type CreateCaregiverRequestUseCaseResponse = Either< 
  NotAllowedError<CreateCaregiverRequestUseCaseRequest>,
  {
    caregiverRequest: CaregiverRequest;
  }
>;

@Injectable()
export class CreateCaregiverRequestUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
  ) {}

  async execute(
    request: CreateCaregiverRequestUseCaseRequest,
  ): Promise<CreateCaregiverRequestUseCaseResponse> {
    const { caregiverId, selfMonitorId } = request;

    if (caregiverId.equals(selfMonitorId)) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "A self-monitor cannot request themselves as a caregiver.",
          },
        ],
      }));
    }

    // Check if a request already exists for the same caregiver and self-monitor
    const existingRequests = await this.caregiverRequestRepository.findBySelfMonitorId(selfMonitorId.toString());
    if (existingRequests.find(req => req.status === "pending")) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "A pending caregiver request already exists for this self-monitor.",
          },
        ],
      }));
    }

    const caregiverRequest = CaregiverRequest.create({
      caregiverId,
      selfMonitorId,
      status: "pending",
      createdAt: new Date(),
    });

    await this.caregiverRequestRepository.create(caregiverRequest);

    return right({
      caregiverRequest,
    });
  }
}

