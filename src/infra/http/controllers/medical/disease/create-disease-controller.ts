import { CreateDiseaseUseCase } from "@/domain/medical/application/use-cases/disease/create-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { DiseasePresenter } from "@/infra/http/presenters/disease-presenter";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(10).max(100)
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)
type CreateDiseaseDto = z.infer<typeof bodySchema>

@Controller("diseases")
export class CrerateDiseaseController{
    constructor(
        private createDiseasesUseCase: CreateDiseaseUseCase
    ) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe){
            name,
            description
        }: CreateDiseaseDto
    ) {
        const result = await this.createDiseasesUseCase.execute({
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