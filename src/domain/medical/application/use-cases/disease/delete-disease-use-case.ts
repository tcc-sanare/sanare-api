import { Either, left, right } from '@/core/either';
import { Disease } from '@/domain/medical/enterprise/entities/disease';
import { Injectable } from '@nestjs/common';
import { DiseaseRepository } from '../../repositories/disease-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteDiseaseUseCaseRequest {
  diseaseId: string;
}

type DeleteDiseaseUseCaseResponse = Either<
  NotAllowedError<DeleteDiseaseUseCaseRequest>,
  {
    disease: Disease;
  }
>;

@Injectable()
export class DeleteDiseaseUseCase {
  constructor(private diseaseRepository: DiseaseRepository) {}

  async execute(
    request: DeleteDiseaseUseCaseRequest,
  ): Promise<DeleteDiseaseUseCaseResponse> {
    const disease = await this.diseaseRepository.findById(request.diseaseId);

    if (!disease) {
      return left(
        new NotAllowedError<DeleteDiseaseUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Doença não encontrada',
            },
          ],
        }),
      );
    }
    await this.diseaseRepository.delete(disease)

    return right({ disease })
  }
}
