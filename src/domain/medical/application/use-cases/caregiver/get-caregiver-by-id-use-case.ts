import { Either, left, right } from "@/core/either";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetCaregiverByIdUseCaseRequest {
  id: string;
}

type GetCaregiverByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetCaregiverByIdUseCaseRequest>,
  {
    caregiver: Caregiver;
  }
>;

@Injectable()
export class GetCaregiverByIdUseCase {
  constructor (
    private caregiverRepository: CaregiverRepository,
  ) {}

  async execute({
    id,
  }: GetCaregiverByIdUseCaseRequest): Promise<GetCaregiverByIdUseCaseResponse> {
    const caregiver = await this.caregiverRepository.findById(id);

    if (!caregiver) {
      return left(new ResourceNotFoundError<GetCaregiverByIdUseCaseRequest>({
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
