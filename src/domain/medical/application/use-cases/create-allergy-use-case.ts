import { Either, left, right } from "@/core/either";
import { Allergy } from "../../enterprise/entities/allergy";
import { All, Injectable } from "@nestjs/common";
import { AllergyRepository } from "../repositories/allergy-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateAllergyUseCaseRequest {
  name: string;
  description?: string;
}

type CreateAllergyUseCaseResponse = Either<
  null,
  {
    allergy: Allergy
  }
>;

@Injectable()
export class CreateAllergyUseCase {

  constructor (
    private allergyRepository: AllergyRepository
  ) {};

  async execute (data: CreateAllergyUseCaseRequest): Promise<CreateAllergyUseCaseResponse> {
    const allergy = Allergy.create(
      {
        name: data.name,
        description: data.description
      }
    );

    try {
      await this.allergyRepository.create(allergy);

      return right({ allergy });
    } catch {
      return left(null);
    }
  }
}