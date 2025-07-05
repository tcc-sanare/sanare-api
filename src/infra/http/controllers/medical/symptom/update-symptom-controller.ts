import { UpdateSymptomUsecase } from "@/domain/medical/application/use-cases/symptom/update-symptom-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { SymptomPresenter } from "@/infra/http/presenters/symptom-presenter";
import { Body, Controller, Param, Put } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

type bodyDto = z.infer<typeof bodySchema>

const bodyValidation =  new ZodValidationPipe(bodySchema)

@Controller("symptoms")
export class UpdateSymptomController {
    constructor(
        private updateSymptomUseCase: UpdateSymptomUsecase
    ) {}

    @Put(':id')
    async handle(
        @Param('id') id: string,
        @Body(bodyValidation) { name, description }: bodyDto
    ) {
        const result = await this.updateSymptomUseCase.execute({
            symptomId: id,
            name,
            description
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.symptom
        })

        return {
            symptom: SymptomPresenter.toHttp(result)
        }
    }
}