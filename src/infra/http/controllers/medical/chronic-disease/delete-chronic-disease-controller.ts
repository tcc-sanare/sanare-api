import { DeleteChronicDiseaseUseCase } from "@/domain/medical/application/use-cases/chronic-disease/delete-chronic-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ChronicDiseasePresenter } from "@/infra/http/presenters/chronic-disease-presenter";
import { Controller, Delete, Param } from "@nestjs/common";

@Controller('chronic-diseases/:id')
export class DeleteChronicDiseaseController{
    constructor(
        private deleteChronicDisease: DeleteChronicDiseaseUseCase
    ) {}
    @Delete()
    async handle(
        @Param('id') id: string
    ) {
        const result = await this.deleteChronicDisease.execute({
            chronicDiseaseId: id
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.chronicDisease
        })

        return {
            deletedChronicDisease: ChronicDiseasePresenter.toHttp(result)
        }
    }
}