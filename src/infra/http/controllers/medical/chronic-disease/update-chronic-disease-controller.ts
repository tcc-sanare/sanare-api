import { UpdateChronicDiseaseUseCase } from "@/domain/medical/application/use-cases/chronic-disease/update-chronic-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ChronicDiseasePresenter } from "@/infra/http/presenters/chronic-disease-presenter";
import { Controller, Put, Body } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    chronicDiseaseId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),

})

interface bodyDto{
  chronicDiseaseId: string;
  name?: string;
  description?: string;
  icon?: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
}

// type BodyDto = z.infer<typeof bodySchema>
const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@Controller('chronic-diseases')
export class UpdateChronicDiseaseController{
    constructor(
        private updateChronicDisease: UpdateChronicDiseaseUseCase
    ) {}
    @Put()
    async handle(
        @Body(bodyValidationPipe) body: bodyDto
    ) {
        // let icon: iconType | null | undefined

        // if (body.icon !== undefined) {
        //     if (body.icon) {
        //         icon = {
        //             fileName: body.icon.fileName,
        //             fileType: body.icon.fileType,
        //             buffer: body.icon.buffer
        //         }
        //     }
        //     icon = null
        // }

        const result = await this.updateChronicDisease.execute({
            chronicDiseaseId: body.chronicDiseaseId,
            name: body?.name,
            description: body?.description,
        })
        .then(res => {
            if (res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.chronicDisease
        })

        return {
            updatedChronicDisease: ChronicDiseasePresenter.toHttp(result)
        }
    }
}