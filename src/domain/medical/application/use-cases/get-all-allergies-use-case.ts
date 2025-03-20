import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Allergy } from "../../enterprise/entities/allergy";
import { AllergyRepository } from "../repositories/allergy-repository";

type GetAllAllergiesUseCaseResponse = Either<
  null,
  {
    allergies: Allergy[];
  }
>;

@Injectable()
export class GetAllAllergiesUseCase {
  
  constructor (
    private allergyRepository: AllergyRepository
  ) {};

  async execute(): Promise<GetAllAllergiesUseCaseResponse> {
    const allergies = await this.allergyRepository.findAll();

    if (!allergies) {
      return left(null);
    }

    return right({ allergies });
  }
}