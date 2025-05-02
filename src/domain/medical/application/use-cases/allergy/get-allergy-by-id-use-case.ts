import { Either, left, right } from '@/core/either';
import { Allergy } from '../../../enterprise/entities/allergy';
import { Injectable } from '@nestjs/common';
import { AllergyRepository } from '../../repositories/allergy-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface GetAllergyByIdUseCaseRequest {
  allergyId: string;
}

type GetAllergyByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetAllergyByIdUseCaseRequest>,
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
      return left(new ResourceNotFoundError<GetAllergyByIdUseCaseRequest>({
        errors: [
          {
            message: 'Alergia não encontrada',
          },
        ],
      }));
    }

    return right({ allergy });
  }
}
