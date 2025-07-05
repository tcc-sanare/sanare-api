import { Disease } from '@/domain/medical/enterprise/entities/disease';
import { Injectable } from '@nestjs/common';
import { DiseaseRepository } from '../../repositories/disease-repository';
import { Either, right } from '@/core/either';

type GetAllDiseaseUseCaseResponse = Either<
  null,
  {
    diseases: Disease[];
  }
>;

@Injectable()
export class GetAllDiseasesUseCase {
  constructor(private diseaseRepository: DiseaseRepository) {}

  async execute(): Promise<GetAllDiseaseUseCaseResponse> {
    const diseases = await this.diseaseRepository.findAll();

    return right({ diseases });
  }
}
