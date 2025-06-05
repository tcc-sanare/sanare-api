import { GetAllChronicDiseasesUseCase } from "@/domain/medical/application/use-cases/chronic-disease/get-all-chronic-diseases-use-case";
import { GetChronicDiseasesByNameUseCase } from "@/domain/medical/application/use-cases/chronic-disease/get-chronic-diseases-by-name-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ChronicDiseasePresenter } from "@/infra/http/presenters/chronic-disease-presenter";
import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const querySchema = z.object({
  name: z.string().optional()
}).openapi('query');

class QueryDto extends createZodDto(querySchema) {};

const queryValidation = new ZodValidationPipe(querySchema);

@Controller("chronic-diseases")
export class GetChronicDiseasesController {
  constructor (
    private getAllChronicDiseases: GetAllChronicDiseasesUseCase,
    private getChronicDiseasesByNameUseCase: GetChronicDiseasesByNameUseCase
  ) {}

  @Get()
  async handle (
    @Query(queryValidation) { name }: QueryDto
  ) {
    console.log(name)
    if (!name) {
      const result = await this.getAllChronicDiseases.execute();

      if (result.isLeft()) {
        throw result.value;
      }

      return {
        chronicDiseases: result.value.chronicDiseases.map(ChronicDiseasePresenter.toHttp)
      }
    }

    const result = await this.getChronicDiseasesByNameUseCase.execute({ name });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      chronicDiseases: result.value.chronicDiseases.map(ChronicDiseasePresenter.toHttp)
    }
  }
}