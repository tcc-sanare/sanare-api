import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";

interface DeleteCaregiverUseCaseRequest {
  caregiverId: UniqueEntityID;
}

type DeleteCaregiverUseCaseResponse = Either<
  NotAllowedError<DeleteCaregiverUseCaseRequest>,
  {}
>;

@Injectable()
export class DeleteCaregiverUseCase {
  constructor (
    private caregiverRepository: CaregiverRepository
  ) {}

  async execute (
    data: DeleteCaregiverUseCaseRequest
  ): Promise<DeleteCaregiverUseCaseResponse> {
    const { caregiverId } = data;

    const caregiver = await this.caregiverRepository.findById(caregiverId.toString());

    if (!caregiver) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "Responsável não encontrado"
          }
        ]
      }));
    }

    await this.caregiverRepository.delete(caregiver);

    return right({});
  }
}