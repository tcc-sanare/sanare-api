import { Either, left, right } from '@/core/either';
import { Disease } from '@/domain/medical/enterprise/entities/disease';
import { DiseaseRepository } from '../../repositories/disease-repository';
import { Injectable } from '@nestjs/common';

interface GetDiseasesByNameUseCaseRequest {
  diseaseName: string;
}

type GetDiseasesByNameUseCaseResponse = Either<
  null,
  {
    diseases: Disease[];
  }
>;
@Injectable()
export class GetDiseasesByNameUseCase {
  constructor(private diseaseRepository: DiseaseRepository) {}

  async execute(
    request: GetDiseasesByNameUseCaseRequest,
  ): Promise<GetDiseasesByNameUseCaseResponse> {
    const diseases = await this.diseaseRepository.findByName(request.diseaseName)
    return right({ diseases });
  }
}
