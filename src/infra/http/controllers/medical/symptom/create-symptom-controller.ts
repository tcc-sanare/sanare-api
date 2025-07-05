import { CreateSymptomUseCase } from "@/domain/medical/application/use-cases/symptom/create-symptom-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { SymptomPresenter } from "@/infra/http/presenters/symptom-presenter";

import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(10).max(100)
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)
type CreateSymptomDto = z.infer<typeof bodySchema>

@Controller("symptoms")
export class CreateSymptomController{
    constructor(
        private createSymptomsUseCase: CreateSymptomUseCase
    ) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe){
            name,
            description
        }: CreateSymptomDto
    ) {
        const result = await this.createSymptomsUseCase.execute({
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