import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Allergy } from '../../../enterprise/entities/allergy';
import { AllergyRepository } from '../../repositories/allergy-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteAllergyUseCaseRequest {
  allergyId: string;
}

type DeleteAllergyUseCaseResponse = Either<
  NotAllowedError<DeleteAllergyUseCaseRequest>,
  {
    allergy: Allergy;
  }
>;

@Injectable()
export class DeleteAllergyUseCase {
  constructor(private allergyRepository: AllergyRepository) {}

  async execute(
    request: DeleteAllergyUseCaseRequest,
  ): Promise<DeleteAllergyUseCaseResponse> {
    const allergy = await this.allergyRepository.findById(request.allergyId);

    if (!allergy) {
      return left(new NotAllowedError<DeleteAllergyUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Alergia não encontrada',
          },
        ],
      })
      );
    }

    await this.allergyRepository.delete(allergy);

    return right({ allergy });
  }
}
