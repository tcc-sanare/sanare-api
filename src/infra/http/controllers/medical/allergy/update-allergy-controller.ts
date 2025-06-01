import { UpdateAllergyUseCase } from "@/domain/medical/application/use-cases/allergy/update-allergy-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Put } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
    allergyId: z.string(),

    name: z.string().optional(),

    description: z.string().optional(),

    icon: z.object({
        fileName: z.string(),
        fileType: z.string(),
        buffer: z.instanceof(Buffer)
    }).nullable()
    
})

type BodyDto = z.infer<typeof bodySchema>
const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@Controller('allergies')
export class UpdateAllergy{
    constructor(
        private updateAllergy: UpdateAllergyUseCase
    ) {}
    @Put()
    async handle(
        @Body(bodyValidationPipe) body: BodyDto
    ) {
        // const result = await this.updateAllergy.execute({
        //     allergyId: body.allergyId,
        //     name: body?.name,
        //     description: body?.description,
        //     icon: body?.icon
        // })
    }
}