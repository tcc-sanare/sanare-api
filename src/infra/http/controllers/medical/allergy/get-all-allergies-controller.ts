import { GetAllAllergiesUseCase } from "@/domain/medical/application/use-cases/allergy/get-all-allergies-use-case";
import { GetAllergiesByNameUseCase } from "@/domain/medical/application/use-cases/allergy/get-allergies-by-name-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AllergyPresenter } from "@/infra/http/presenters/allergy-presenter";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createZodDto } from "nestjs-zod";
import { ZodValidatedQuery } from "@/infra/http/pipes/zod-validated-query";
import { Allergy } from "@/domain/medical/enterprise/entities/allergy";
import { makeAllergy } from "test/factories/make-allergy";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";

extendZodWithOpenApi(z);

const querySchema = z.object({
  name: z.string().optional().openapi({
    description: 'Name of the allergy to search for',
    example: 'Peanut',
  }),
  age: z.number().optional().openapi({
    description: 'Age of the patient',
    example: 30,
  })
}).openapi('query');

class QueryDto extends createZodDto(querySchema) {}

const queryValidation = new ZodValidationPipe(querySchema);

@Controller('allergies')
export class GetAllAllergiesController {
  constructor (
    private getAllAllergiesUseCase: GetAllAllergiesUseCase,
    private getAllergiesByNameUseCase: GetAllergiesByNameUseCase,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return a list of allergies',
  })
  @ZodValidatedQuery(querySchema)
  async handle(
    @Query(queryValidation) { name }: QueryDto,
  ) {
    const result = name
      ? await this.getAllergiesByNameUseCase.execute({ name })
      : await this.getAllAllergiesUseCase.execute();

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      allergies: result.value.allergies.map(AllergyPresenter.toHttp)
    };
  }
}