import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Symptom } from '@/domain/medical/enterprise/entities/symptom';
import { Injectable } from '@nestjs/common';
import { SymptomRepository } from '../../repositories/symptom-repository';

interface GetSymptomByIdUseCaseRequest {
  symptomId: string;
}

type GetSymptomByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetSymptomByIdUseCaseRequest>,
  {
    symptom: Symptom;
  }
>;

@Injectable()
export class GetSymptomByIdUseCase {
  constructor(private symptomRepository: SymptomRepository) {}

  async execute(
    request: GetSymptomByIdUseCaseRequest,
  ): Promise<GetSymptomByIdUseCaseResponse> {
    const symptom = await this.symptomRepository.findById(request.symptomId);

    if (!symptom) {
      return left(
        new ResourceNotFoundError<GetSymptomByIdUseCaseRequest>({
          errors: [
            {
              message: 'Sintoma não encontrada',
            },
          ],
        }),
      );
    }

    return right({ symptom })
  }
}
