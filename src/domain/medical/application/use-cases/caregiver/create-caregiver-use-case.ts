import { Either, left, right } from "@/core/either";
import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";
import { Injectable } from "@nestjs/common";
import { CaregiverRepository } from "../../repositories/caregiver-repository";

interface CreateCaregiverUseCaseRequest {
  userId: string;
}

type CreateCaregiverUseCaseResponse = Either<
  null,
  {
    caregiver: Caregiver;
  }
>;

@Injectable()
export class CreateCaregiverUseCase {
  constructor(
    private caregiverRepository: CaregiverRepository,
  ) {}

  async execute({
    userId,
  }: CreateCaregiverUseCaseRequest): Promise<CreateCaregiverUseCaseResponse> {
    const caregiver = Caregiver.create({
      userId: new UniqueEntityID(userId),
    });

    if (await this.caregiverRepository.findByUserId(userId)) {
      return left(null);
    }

    await this.caregiverRepository.create(caregiver);

    return right({ caregiver });
  }
}