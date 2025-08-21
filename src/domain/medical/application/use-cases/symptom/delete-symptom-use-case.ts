import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Symptom } from '@/domain/medical/enterprise/entities/symptom';
import { Injectable } from '@nestjs/common';
import { SymptomRepository } from '../../repositories/symptom-repository';

interface DeleteSymptomUseCaseRequest {
  symptomId: string;
}

type DeleteSymptomUseCaseResponse = Either<
  NotAllowedError<DeleteSymptomUseCaseRequest>,
  {
    symptom: Symptom;
  }
>;

@Injectable()
export class DeleteSymptomUseCase {
  constructor(private symptomRepository: SymptomRepository) {}

  async execute(
    request: DeleteSymptomUseCaseRequest,
  ): Promise<DeleteSymptomUseCaseResponse> {
    const symptom = await this.symptomRepository.findById(request.symptomId);

    if (!symptom) {
      return left(
        new NotAllowedError<DeleteSymptomUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Doença não encontrada',
            },
          ],
        }),
      );
    }

    await this.symptomRepository.delete(symptom)
    return right({ symptom })
  }
}
