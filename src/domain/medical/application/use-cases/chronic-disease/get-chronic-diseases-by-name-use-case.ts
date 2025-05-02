import { Either, left, right } from '@/core/either';
import { ChronicDisease } from '../../../enterprise/entities/chronic-disease';
import { Injectable } from '@nestjs/common';
import { ChronicDiseaseRepository } from '../../repositories/chronic-disease-repository';

interface GetChronicDiseasesByNameUseCaseRequest {
  name: string;
}

type GetChronicDiseasesByNameUseCaseResponse = Either<
  null,
  {
    chronicDiseases: ChronicDisease[];
  }
>;

@Injectable()
export class GetChronicDiseasesByNameUseCase {
  constructor(private chronicDiseaseRepository: ChronicDiseaseRepository) {}

  async execute(
    request: GetChronicDiseasesByNameUseCaseRequest,
  ): Promise<GetChronicDiseasesByNameUseCaseResponse> {
    const chronicDiseases = await this.chronicDiseaseRepository.findByName(
      request.name,
    );

    return right({ chronicDiseases });
  }
}
