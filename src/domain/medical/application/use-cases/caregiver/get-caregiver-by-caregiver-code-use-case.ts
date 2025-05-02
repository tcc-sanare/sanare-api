import { Either, left, right } from "@/core/either";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetCaregiverByCaregiverCodeUseCaseRequest {
  caregiverCode: string;
}

type GetCaregiverByCaregiverCodeUseCaseResponse = Either<
  ResourceNotFoundError<GetCaregiverByCaregiverCodeUseCaseRequest>,
  {
    caregiver: Caregiver;
  }
>;

@Injectable()
export class GetCaregiverByCaregiverCodeUseCase {
  constructor(
    private caregiverRepository: CaregiverRepository,
  ) {}

  async execute({
    caregiverCode,
  }: GetCaregiverByCaregiverCodeUseCaseRequest): Promise<GetCaregiverByCaregiverCodeUseCaseResponse> {
    const caregiver = await this.caregiverRepository.findByCaregiverCode(new UniqueCaregiverCode(caregiverCode));

    if (!caregiver) {
      return left(new ResourceNotFoundError<GetCaregiverByCaregiverCodeUseCaseRequest>({
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