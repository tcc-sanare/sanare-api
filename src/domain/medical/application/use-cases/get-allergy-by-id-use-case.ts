import { Either, left, right } from '@/core/either';
import { Allergy } from '../../enterprise/entities/allergy';
import { Injectable } from '@nestjs/common';
import { AllergyRepository } from '../repositories/allergy-repository';

interface GetAllergyByIdUseCaseRequest {
  allergyId: string;
}

type GetAllergyByIdUseCaseResponse = Either<
  null,
  {
    allergy: Allergy;
  }
>;

@Injectable()
export class GetAllergyByIdUseCase {
  constructor(private allergyRepository: AllergyRepository) {}

  async execute(
    request: GetAllergyByIdUseCaseRequest,
  ): Promise<GetAllergyByIdUseCaseResponse> {
    const allergy = await this.allergyRepository.findById(request.allergyId);

    if (!allergy) {
      return left(null);
    }

    return right({ allergy });
  }
}
