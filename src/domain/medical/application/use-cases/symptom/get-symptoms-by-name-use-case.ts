import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Symptom } from '@/domain/medical/enterprise/entities/symptom';
import { Injectable } from '@nestjs/common';
import { SymptomRepository } from '../../repositories/symptom-repository';

interface GetSymptomByNameUseCaseRequest {
  symptomName: string;
}

type GetSymptomByNameUseCaseResponse = Either<
  null,
  {
    symptoms: Symptom[];
  }
>;

@Injectable()
export class GetSymptomByNameUseCase {
  constructor(private symptomRepository: SymptomRepository) {}

  async execute(
    request: GetSymptomByNameUseCaseRequest,
  ): Promise<GetSymptomByNameUseCaseResponse> {
    const symptoms = await this.symptomRepository.findByName(
      request.symptomName,
    );

    return right({ symptoms })
  }
}
