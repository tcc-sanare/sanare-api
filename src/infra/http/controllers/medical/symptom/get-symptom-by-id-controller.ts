import { GetSymptomByIdUseCase } from "@/domain/medical/application/use-cases/symptom/get-symptom-by-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { SymptomPresenter } from "@/infra/http/presenters/symptom-presenter";
import { Controller, Get, Param } from "@nestjs/common";
import { z } from "zod";

const paramSchema = z.object({
    id: z.string().uuid()
}).required()

const paramValidation = new ZodValidationPipe(paramSchema)

type paramType = z.infer<typeof paramSchema>

@Controller("symptoms")
export class GetSymptomByIdController{
    constructor(
        private getSymptomByIdUseCase: GetSymptomByIdUseCase
    ) {}

    @Get(':id')
    async handle(
        @Param(paramValidation) { id }: paramType
    ) {
        const result = await this.getSymptomByIdUseCase.execute({
            symptomId: id
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