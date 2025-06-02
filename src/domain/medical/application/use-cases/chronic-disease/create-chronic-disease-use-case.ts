import { Either, left, right } from '@/core/either';
import { ChronicDisease } from '@/domain/medical/enterprise/entities/chronic-disease';
import { Injectable } from '@nestjs/common';
import { ChronicDiseaseRepository } from '../../repositories/chronic-disease-repository';
import { Storage } from '@/domain/application/storage';

interface CreateChronicDiseaseUseCaseRequest {
  name: string;
  description?: string;
  icon?: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
}

type CreateChronicDiseaseUseCaseResponse = Either<
  null,
  {
    chronicDisease: ChronicDisease;
  }
>;

@Injectable()
export class CreateChronicDiseaseUseCase {
  constructor(
    private chronicDiseaseRepository: ChronicDiseaseRepository,
    private storage: Storage,
  ) {}

  async execute(
    data: CreateChronicDiseaseUseCaseRequest,
  ): Promise<CreateChronicDiseaseUseCaseResponse> {
    const chronicDisease = ChronicDisease.create({
      name: data.name,
      description: data.description,
    });

    await this.chronicDiseaseRepository.create(chronicDisease);

    return right({
      chronicDisease,
    });
  }
}
