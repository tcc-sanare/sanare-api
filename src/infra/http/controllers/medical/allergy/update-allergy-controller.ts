import { UpdateAllergyUseCase } from '@/domain/medical/application/use-cases/allergy/update-allergy-use-case';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { AllergyPresenter } from '@/infra/http/presenters/allergy-presenter';
import { Body, Controller, Param, Put } from '@nestjs/common';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().optional(),
  type: z.enum(['antibiotic', 'anti-inflammatory', 'analgesic', 'anticonvulsant']).optional(),
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller('allergies/:allergyId')
export class UpdateAllergy {
  constructor(private updateAllergy: UpdateAllergyUseCase) {}

  @Put()
  async handle(
    @Body(bodyValidation) data: BodyDto,
    @Param('allergyId') allergyId: string,
) {
    const allergy = await this.updateAllergy.execute({
        allergyId,
        name: data?.name,
        type: data?.type,
    }).then(result => {
        if (result.isLeft()) throw new CustomHttpException(result.value);

        return result.value.allergy;
    });

    return {
      allergy: AllergyPresenter.toHttp(allergy),
    };
  }
}
