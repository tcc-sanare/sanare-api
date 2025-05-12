import { CreateAllergyUseCase } from "@/domain/medical/application/use-cases/allergy/create-allergy-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AllergyPresenter } from "@/infra/http/presenters/allergy-presenter";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const createAllergyBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

type CreateAllergyDto = z.infer<typeof createAllergyBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createAllergyBodySchema);

@Controller("allergies")
export class CreateAllergyController {
  constructor (
    private createAllergyUseCase: CreateAllergyUseCase,
  ) {}

  @Post()
  async handle (
    @Body(bodyValidationPipe) {
      name,
      description,
    }: CreateAllergyDto,
  ) {
    const result = await this.createAllergyUseCase.execute({
      name,
      description,
    });

    return {
      allergy: AllergyPresenter.toHttp(result.value.allergy),
    };
  }
}