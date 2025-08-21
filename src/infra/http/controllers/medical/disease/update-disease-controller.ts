import { UpdateDiseaseUseCase } from "@/domain/medical/application/use-cases/disease/update-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { DiseasePresenter } from "@/infra/http/presenters/disease-presenter";
import { Body, Controller, Param, Put } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

type bodyDto = z.infer<typeof bodySchema>

const bodyValidation =  new ZodValidationPipe(bodySchema)

@Controller("diseases")
export class UpdateDiseaseController {
    constructor(
        private updateDiseaseUseCase: UpdateDiseaseUseCase
    ) {}

    @Put(':id')
    async handle(
        @Param('id') id: string,
        @Body(bodyValidation) { name, description }: bodyDto
    ) {
        const result = await this.updateDiseaseUseCase.execute({
            diseaseId: id,
            name,
            description
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.disease
        })

        return {
            disease: DiseasePresenter.toHttp(result)
        }
    }
}