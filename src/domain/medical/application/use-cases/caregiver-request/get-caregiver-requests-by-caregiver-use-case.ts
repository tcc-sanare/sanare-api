import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";

interface GetCaregiverRequestsByCaregiverUseCaseRequest {
  caregiverId: UniqueEntityID;
}

type GetCaregiverRequestByCaregiverUseCaseResponse = Either< 
  null,
  {
    caregiverRequests: CaregiverRequest[];
  }
>;

@Injectable()
export class GetCaregiverRequestsByCaregiverUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
  ) {}

  async execute(
    request: GetCaregiverRequestsByCaregiverUseCaseRequest,
  ): Promise<GetCaregiverRequestByCaregiverUseCaseResponse> {
    const { caregiverId } = request;

    const caregiverRequests = await this.caregiverRequestRepository.findByCaregiverId(caregiverId.toString());

    if (!caregiverRequests) {
      return left(null);
    }

    return right({
      caregiverRequests,
    });
  }
}