import { Either, left, right } from "@/core/either";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetCaregiverByUserIdUseCaseRequest {
  userId: string;
}

type GetCaregiverByUserIdUseCaseResponse = Either<
  ResourceNotFoundError<GetCaregiverByUserIdUseCaseRequest>,
  {
    caregiver: Caregiver;
  }
>;

@Injectable()
export class GetCaregiverByUserIdUseCase {
  constructor(
    private caregiverRepository: CaregiverRepository,
  ) {}

  async execute({
    userId,
  }: GetCaregiverByUserIdUseCaseRequest): Promise<GetCaregiverByUserIdUseCaseResponse> {
    const caregiver = await this.caregiverRepository.findByUserId(userId);

    if (!caregiver) {
      return left(new ResourceNotFoundError<GetCaregiverByUserIdUseCaseRequest>({
        errors: [
          {
            message: "Cuidador não encontrado",
          },
        ],
      }));
    }

    return right({ caregiver });
  }
}
