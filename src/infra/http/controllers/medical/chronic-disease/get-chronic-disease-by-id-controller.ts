import { GetChronicDiseaseByIdUseCase } from "@/domain/medical/application/use-cases/chronic-disease/get-chronic-disease-by-id-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ChronicDiseasePresenter } from "@/infra/http/presenters/chronic-disease-presenter";
import { Controller, Get, Param } from "@nestjs/common";
import { z } from "zod";

const paramSchema = z.object({
  chronicDiseaseId: z.string().uuid()
}).required();

type ParamDto = z.infer<typeof paramSchema>;

const paramValidation = new ZodValidationPipe(paramSchema);

@Controller("chronic-diseases/:chronicDiseaseId")
export class GetChronicDiseaseById {
  constructor (
    private getChronicDiseaseByIdUseCase: GetChronicDiseaseByIdUseCase
  ) {}

  @Get()
  async handle (
    @Param(paramValidation) { chronicDiseaseId }: ParamDto
  ) {
    const result = await this.getChronicDiseaseByIdUseCase.execute({ chronicDiseaseId });

    if (result.isLeft()) {
      throw result.value;
    }

    return {
      chronicDisease: ChronicDiseasePresenter.toHttp(result.value.chronicDisease)
    }
  }
}