import { UpdateChronicDiseaseUseCase } from "@/domain/medical/application/use-cases/chronic-disease/update-chronic-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ChronicDiseasePresenter } from "@/infra/http/presenters/chronic-disease-presenter";
import { Controller, Put, Body, Param } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
});

type BodyDto = z.infer<typeof bodySchema>

const bodyValidation = new ZodValidationPipe(bodySchema)

@Controller('chronic-diseases/:chronicDiseaseId')
export class UpdateChronicDiseaseController{
    constructor(
        private updateChronicDisease: UpdateChronicDiseaseUseCase
    ) {}
    @Put()
    async handle(
        @Param('chronicDiseaseId') chronicDiseaseId: string,
        @Body(bodyValidation) body: BodyDto
    ) {

        const result = await this.updateChronicDisease.execute({
            chronicDiseaseId: chronicDiseaseId,
            name: body?.name,
            description: body?.description,
        })
        .then(res => {
            if (res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.chronicDisease
        })

        return {
            chronicDisease: ChronicDiseasePresenter.toHttp(result)
        }
    }
}