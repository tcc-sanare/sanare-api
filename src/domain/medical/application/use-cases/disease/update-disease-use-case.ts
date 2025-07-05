import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Disease } from '@/domain/medical/enterprise/entities/disease';
import { Injectable } from '@nestjs/common';
import { DiseaseRepository } from '../../repositories/disease-repository';

interface UpdateDiseaseUseCaseRequest {
  diseaseId: string;
  name?: string;
  description?: string;
}

type UpdateDiseaseUseCaseResponse = Either<
  NotAllowedError<UpdateDiseaseUseCaseRequest>,
  {
    disease: Disease;
  }
>;

@Injectable()
export class UpdateDiseaseUseCase {
  constructor(private diseaseRepository: DiseaseRepository) {}

  async execute(
    request: UpdateDiseaseUseCaseRequest,
  ): Promise<UpdateDiseaseUseCaseResponse> {
    const disease = await this.diseaseRepository.findById(request.diseaseId);

    if (!disease) {
      return left(
        new NotAllowedError<UpdateDiseaseUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Doença não encontrada',
            },
          ],
        }),
      );
    }

    request.name && (disease.name = request.name);
    request.description && (disease.description = request.description);

    await this.diseaseRepository.save(disease);
    return right({ disease });
  }
}
