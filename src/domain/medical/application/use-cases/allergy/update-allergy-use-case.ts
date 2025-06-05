import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Allergy, AllergyType } from '../../../enterprise/entities/allergy';
import { AllergyRepository } from '../../repositories/allergy-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface UpdateAllergyUseCaseRequest {
  allergyId: string;
  name?: string;
  type?: AllergyType;
}

type UpdateAllergyUseCaseResponse = Either<
  NotAllowedError<UpdateAllergyUseCaseRequest>,
  {
    allergy: Allergy;
  }
>;

@Injectable()
export class UpdateAllergyUseCase {
  constructor(
    private allergyRepository: AllergyRepository,
  ) {}

  async execute(
    request: UpdateAllergyUseCaseRequest,
  ): Promise<UpdateAllergyUseCaseResponse> {
    const allergy = await this.allergyRepository.findById(request.allergyId);

    if (!allergy) {
      return left(new NotAllowedError<UpdateAllergyUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Alergia não encontrada',
          },
        ],
      }));
    }

    request.name && (allergy.name = request.name);
    request.type && (allergy.type = request.type);

    await this.allergyRepository.save(allergy);

    return right({ allergy });
  }
}
