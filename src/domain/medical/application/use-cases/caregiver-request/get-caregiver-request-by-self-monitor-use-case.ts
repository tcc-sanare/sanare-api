import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";

interface GetCaregiverRequestBySelfMonitorUseCaseRequest {
  selfMonitorId: UniqueEntityID;
}

type GetCaregiverRequestBySelfMonitorUseCaseResponse = Either< 
  null,
  {
    caregiverRequests: CaregiverRequest[];
  }
>;

@Injectable()
export class GetCaregiverRequestBySelfMonitorUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
  ) {}

  async execute(
    request: GetCaregiverRequestBySelfMonitorUseCaseRequest,
  ): Promise<GetCaregiverRequestBySelfMonitorUseCaseResponse> {
    const { selfMonitorId } = request;

    const caregiverRequests = await this.caregiverRequestRepository.findBySelfMonitorId(selfMonitorId.toString());

    return right({
      caregiverRequests,
    });
  }
}