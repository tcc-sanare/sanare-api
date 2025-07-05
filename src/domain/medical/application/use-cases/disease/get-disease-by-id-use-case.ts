import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Disease } from '@/domain/medical/enterprise/entities/disease';
import { DiseaseRepository } from '../../repositories/disease-repository';
import { Injectable } from '@nestjs/common';

interface GetDiseaseByIdUseCaseRequest {
  diseaseId: string;
}

type GetDiseaseByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetDiseaseByIdUseCaseRequest>,
  { disease: Disease }
>;

@Injectable()
export class GetDiseaseByIdUseCase {
  constructor(private diseaseRepository: DiseaseRepository) {}

  async execute(
    request: GetDiseaseByIdUseCaseRequest,
  ): Promise<GetDiseaseByIdUseCaseResponse> {
    const disease = await this.diseaseRepository.findById(request.diseaseId);

    if (!disease) {
      return left(
        new ResourceNotFoundError<GetDiseaseByIdUseCaseRequest>({
          errors: [
            {
              message: 'Doença não encontrada',
            },
          ],
        }),
      );
    }
    return right({ disease });
  }
}
