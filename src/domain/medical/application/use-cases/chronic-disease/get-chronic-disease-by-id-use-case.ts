import { Either, left, right } from '@/core/either';
import { ChronicDisease } from '../../../enterprise/entities/chronic-disease';
import { Injectable } from '@nestjs/common';
import { ChronicDiseaseRepository } from '../../repositories/chronic-disease-repository';

interface GetChronicDiseaseByIdUseCaseRequest {
  chronicDiseaseId: string;
}

type GetChronicDiseaseByIdUseCaseResponse = Either<
  null,
  {
    chronicDisease: ChronicDisease;
  }
>;

@Injectable()
export class GetChronicDiseaseByIdUseCase {
  constructor(private chronicDiseaseRepository: ChronicDiseaseRepository) {}

  async execute(
    request: GetChronicDiseaseByIdUseCaseRequest,
  ): Promise<GetChronicDiseaseByIdUseCaseResponse> {
    const chronicDisease = await this.chronicDiseaseRepository.findById(request.chronicDiseaseId);

    if (!chronicDisease) {
      return left(null);
    }

    return right({ chronicDisease });
  }
}
