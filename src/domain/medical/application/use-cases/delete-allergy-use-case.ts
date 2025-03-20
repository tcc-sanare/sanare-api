import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Allergy } from "../../enterprise/entities/allergy";
import { AllergyRepository } from "../repositories/allergy-repository";

interface DeleteAllergyUseCaseRequest {
  allergyId: string;
}

type DeleteAllergyUseCaseResponse = Either<
  null,
  {
    allergy: Allergy;
  }
>;

@Injectable()
export class DeleteAllergyUseCase {

  constructor (
    private allergyRepository: AllergyRepository
  ) {};

  async execute(request: DeleteAllergyUseCaseRequest): Promise<DeleteAllergyUseCaseResponse> {
    const allergy = await this.allergyRepository.findById(request.allergyId);

    if (!allergy) {
      return left(null);
    }

    await this.allergyRepository.delete(allergy);

    return right({ allergy });
  }
}