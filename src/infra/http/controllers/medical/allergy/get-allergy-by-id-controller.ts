import { GetAllergyByIdUseCase } from "@/domain/medical/application/use-cases/allergy/get-allergy-by-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AllergyPresenter } from "@/infra/http/presenters/allergy-presenter";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('allergies/:allergyId')
export class GetAllergyByIdController {
  constructor (
    private getAllergyByIdUseCase: GetAllergyByIdUseCase,
  ) {}

  @Get()
  async handle(@Param('allergyId') allergyId: string) {
    const result = await this.getAllergyByIdUseCase.execute({ allergyId });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      allergy: AllergyPresenter.toHttp(result.value.allergy)
    };
  }
}