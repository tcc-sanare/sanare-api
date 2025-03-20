import { Either, left, right } from '@/core/either';
import { Allergy } from '../../enterprise/entities/allergy';
import { Injectable } from '@nestjs/common';
import { AllergyRepository } from '../repositories/allergy-repository';

interface GetAllergiesByNameUseCaseRequest {
  name: string;
}

type GetAllergiesByNameUseCaseResponse = Either<
  null,
  {
    allergies: Allergy[];
  }
>;

@Injectable()
export class GetAllergiesByNameUseCase {
  constructor(private allergyRepository: AllergyRepository) {}

  async execute(
    request: GetAllergiesByNameUseCaseRequest,
  ): Promise<GetAllergiesByNameUseCaseResponse> {
    const allergies = await this.allergyRepository.findByName(request.name);

    if (!allergies) {
      return left(null);
    }

    return right({ allergies });
  }
}
