import { Either, left, right } from '@/core/either';
import { ChronicDisease } from '../../../enterprise/entities/chronic-disease';
import { Injectable } from '@nestjs/common';
import { ChronicDiseaseRepository } from '../../repositories/chronic-disease-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface GetChronicDiseaseByIdUseCaseRequest {
  chronicDiseaseId: string;
}

type GetChronicDiseaseByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetChronicDiseaseByIdUseCaseRequest>,
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
    const chronicDisease = await this.chronicDiseaseRepository.findById(
      request.chronicDiseaseId,
    );

    if (!chronicDisease) {
      return left(new ResourceNotFoundError<GetChronicDiseaseByIdUseCaseRequest>({
        errors: [
          {
            message: 'Doença crônica não encontrada',
          },
        ],
      }));
    }

    return right({ chronicDisease });
  }
}
