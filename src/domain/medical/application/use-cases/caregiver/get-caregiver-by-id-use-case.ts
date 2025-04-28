import { Either, left, right } from "@/core/either";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";

interface GetCaregiverByIdUseCaseRequest {
  id: string;
}

type GetCaregiverByIdUseCaseResponse = Either<
  null,
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
      return left(null);
    }

    return right({ caregiver });
  }
}
