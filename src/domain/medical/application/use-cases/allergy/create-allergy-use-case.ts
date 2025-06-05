import { Either, left, right } from '@/core/either';
import { Allergy, AllergyType } from '../../../enterprise/entities/allergy';
import { Injectable } from '@nestjs/common';
import { AllergyRepository } from '../../repositories/allergy-repository';

interface CreateAllergyUseCaseRequest {
  name: string;
  type: AllergyType;
}

type CreateAllergyUseCaseResponse = Either<
  null,
  {
    allergy: Allergy;
  }
>;

@Injectable()
export class CreateAllergyUseCase {
  constructor(
    private allergyRepository: AllergyRepository,
  ) {}

  async execute(
    data: CreateAllergyUseCaseRequest,
  ): Promise<CreateAllergyUseCaseResponse> {
    const allergy = Allergy.create({
      name: data.name,
      type: data.type,
    });
    
    await this.allergyRepository.create(allergy);

    return right({ allergy });
  }
}
