import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Allergy } from "../../enterprise/entities/allergy";
import { AllergyRepository } from "../repositories/allergy-repository";

interface UpdateAllergyUseCaseRequest {
    allergyId: string;
    name?: string;
    description?: string;
}

type UpdateAllergyUseCaseResponse = Either<
  null,
  {
    allergy: Allergy;
  }
>;

@Injectable()
export class UpdateAllergyUseCase {

  constructor (
    private allergyRepository: AllergyRepository
  ) {};

  async execute(request: UpdateAllergyUseCaseRequest): Promise<UpdateAllergyUseCaseResponse> {
    const allergy = await this.allergyRepository.findById(request.allergyId);

    if (!allergy) {
      return left(null);
    }

    request.name && (allergy.name = request.name);
    request.description && (allergy.description = request.description);

    await this.allergyRepository.save(allergy);

    return right({ allergy });
  }
}