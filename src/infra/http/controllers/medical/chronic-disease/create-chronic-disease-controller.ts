import { CreateChronicDiseaseUseCase } from "@/domain/medical/application/use-cases/chronic-disease/create-chronic-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ChronicDiseasePresenter } from "@/infra/http/presenters/chronic-disease-presenter";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const createChronicDiseaseBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

type CreateChronicDiseaseDto = z.infer<typeof createChronicDiseaseBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createChronicDiseaseBodySchema);

@Controller("chronic-diseases")
export class CreateChronicDiseaseController {
  constructor (
    private createChronicDiseaseUseCase: CreateChronicDiseaseUseCase,
  ) {}

  @Post()
  async handle (
    @Body(bodyValidationPipe) {
      name,
      description,
    }: CreateChronicDiseaseDto,
  ) {
    const chronicDisease = await this.createChronicDiseaseUseCase.execute({
      name,
      description,
    })
    .then(res => {
      if (res.isLeft()) throw new CustomHttpException(res.value)
      return res.value.chronicDisease
    })

    return {
      chronicDisease: ChronicDiseasePresenter.toHttp(chronicDisease),
    };
  }
}