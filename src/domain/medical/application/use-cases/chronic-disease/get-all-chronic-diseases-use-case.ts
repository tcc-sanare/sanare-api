import { Either, left, right } from "@/core/either";
import { ChronicDisease } from "@/domain/medical/enterprise/entities/chronic-disease";
import { Injectable } from "@nestjs/common";
import { ChronicDiseaseRepository } from "../../repositories/chronic-disease-repository";

type GetAllChronicDiseasesUseCaseResponse = Either<
  null,
  {
    chronicDiseases: ChronicDisease[];
  }
>;

@Injectable()
export class GetAllChronicDiseasesUseCase {
  constructor(private chronicDiseaseRepository: ChronicDiseaseRepository) {}

  async execute(): Promise<GetAllChronicDiseasesUseCaseResponse> {
    const chronicDiseases = await this.chronicDiseaseRepository.findAll();

    return right({
      chronicDiseases,
    });
  }
}