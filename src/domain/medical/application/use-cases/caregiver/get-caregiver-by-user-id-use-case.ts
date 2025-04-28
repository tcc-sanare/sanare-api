import { Either, left, right } from "@/core/either";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";

interface GetCaregiverByUserIdUseCaseRequest {
  userId: string;
}

type GetCaregiverByUserIdUseCaseResponse = Either<
  null,
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
      return left(null);
    }

    return right({ caregiver });
  }
}
