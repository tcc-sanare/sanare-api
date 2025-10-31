import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";

interface DeleteCaregiverRequestUseCaseRequest {
  caregiverRequestId: UniqueEntityID;
}

type DeleteCaregiverRequestUseCaseResponse = Either<
  NotAllowedError<DeleteCaregiverRequestUseCaseRequest>,
  {}
>;

@Injectable()
export class DeleteCaregiverRequestUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
  ) {}

  async execute(
    request: DeleteCaregiverRequestUseCaseRequest,
  ): Promise<DeleteCaregiverRequestUseCaseResponse> {
    const { caregiverRequestId } = request;

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

    await this.caregiverRequestRepository.delete(caregiverRequest);

    return right({});
  }
}