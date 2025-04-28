import { Either, left, right } from "@/core/either";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";

interface GetCaregiverByCaregiverCodeUseCaseRequest {
  caregiverCode: string;
}

type GetCaregiverByCaregiverCodeUseCaseResponse = Either<
  null,
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
      return left(null);
    }

    return right({ caregiver });
  }
}