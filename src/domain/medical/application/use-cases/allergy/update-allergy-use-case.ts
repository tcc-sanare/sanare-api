import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Allergy } from '../../../enterprise/entities/allergy';
import { AllergyRepository } from '../../repositories/allergy-repository';
import { Storage } from '@/domain/application/storage';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface UpdateAllergyUseCaseRequest {
  allergyId: string;
  name?: string;
  description?: string;
  icon?: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
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
    private storage: Storage,
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

    if (request.icon === null && allergy.iconKey) {
      await this.storage.delete(allergy.iconKey);
      allergy.iconKey = null;
    }

    request.name && (allergy.name = request.name);
    request.description && (allergy.description = request.description);

    await this.allergyRepository.save(allergy);

    return right({ allergy });
  }
}
