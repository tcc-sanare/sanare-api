import { GetDiseaseByIdUseCase } from "@/domain/medical/application/use-cases/disease/get-disease-by-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { DiseasePresenter } from "@/infra/http/presenters/disease-presenter";
import { Controller, Get, Param } from "@nestjs/common";
import { z } from "zod";

const paramSchema = z.object({
    id: z.string().uuid()
}).required()

const paramValidation = new ZodValidationPipe(paramSchema)

type paramType = z.infer<typeof paramSchema>

@Controller("diseases")
export class GetDiseaseByIdController{
    constructor(
        private getDiseaseByIdUseCase: GetDiseaseByIdUseCase
    ) {}

    @Get(':id')
    async handle(
        @Param(paramValidation) { id }: paramType
    ) {
        const result = await this.getDiseaseByIdUseCase.execute({
            diseaseId: id
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