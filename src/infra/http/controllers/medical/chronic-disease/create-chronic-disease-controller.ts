import { CreateChronicDiseaseUseCase } from "@/domain/medical/application/use-cases/chronic-disease/create-chronic-disease-use-case";
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
    const result = await this.createChronicDiseaseUseCase.execute({
      name,
      description,
    });

    return {
      chronicDisease: ChronicDiseasePresenter.toHttp(result.value.chronicDisease),
    };
  }
}