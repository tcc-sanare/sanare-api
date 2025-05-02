import { Either, left, right } from '@/core/either';
import { Allergy } from '../../../enterprise/entities/allergy';
import { Injectable } from '@nestjs/common';
import { AllergyRepository } from '../../repositories/allergy-repository';
import { Storage } from '@/domain/application/storage';

interface CreateAllergyUseCaseRequest {
  name: string;
  description?: string;
  icon?: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
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
    private storage: Storage,
  ) {}

  async execute(
    data: CreateAllergyUseCaseRequest,
  ): Promise<CreateAllergyUseCaseResponse> {
    const allergy = Allergy.create({
      name: data.name,
      description: data.description,
      iconKey:
        data.icon &&
        (await this.storage.upload(data.icon).then((res) => res.fileKey)),
    });
    
    await this.allergyRepository.create(allergy);

    return right({ allergy });
  }
}
