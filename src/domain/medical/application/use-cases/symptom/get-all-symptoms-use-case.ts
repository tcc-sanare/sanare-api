import { Either, right } from '@/core/either';
import { Symptom } from '@/domain/medical/enterprise/entities/symptom';
import { Injectable } from '@nestjs/common';
import { SymptomRepository } from '../../repositories/symptom-repository';

type GetAllSymptomsUsecaseResponse = Either<
  null,
  {
    symptoms: Symptom[];
  }
>;

@Injectable()
export class GetAllSymptomsUseCase {
  constructor(private symptomRepository: SymptomRepository) {}

  async execute(): Promise<GetAllSymptomsUsecaseResponse> {
    const symptoms = await this.symptomRepository.findAll();

    return right({ symptoms });
  }
}
