import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ChronicDisease } from '../../../enterprise/entities/chronic-disease';
import { ChronicDiseaseRepository } from '../../repositories/chronic-disease-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteChronicDiseaseUseCaseRequest {
  chronicDiseaseId: string;
}

type DeleteChronicDiseaseUseCaseResponse = Either<
  NotAllowedError<DeleteChronicDiseaseUseCaseRequest>,
  {
    chronicDisease: ChronicDisease;
  }
>;

@Injectable()
export class DeleteChronicDiseaseUseCase {
  constructor(private chronicDiseaseRepository: ChronicDiseaseRepository) {}

  async execute(
    request: DeleteChronicDiseaseUseCaseRequest,
  ): Promise<DeleteChronicDiseaseUseCaseResponse> {
    const chronicDisease = await this.chronicDiseaseRepository.findById(
      request.chronicDiseaseId,
    );

    if (!chronicDisease) {
      return left(new NotAllowedError<DeleteChronicDiseaseUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Doença crônica não encontrada',
          },
        ],
      }));
    }

    await this.chronicDiseaseRepository.delete(chronicDisease);

    return right({ chronicDisease });
  }
}
