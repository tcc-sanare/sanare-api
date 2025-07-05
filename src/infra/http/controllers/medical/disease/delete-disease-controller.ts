import { DeleteDiseaseUseCase } from "@/domain/medical/application/use-cases/disease/delete-disease-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { DiseasePresenter } from "@/infra/http/presenters/disease-presenter";
import { Controller, Delete, Param } from "@nestjs/common";

@Controller("diseases")
export class DeleteDiseaseController{
    constructor(
        private deleteDiseaseUseCase: DeleteDiseaseUseCase
    ) {}

    @Delete(':id')
    async handle(
        @Param('id') id: string
    ) {
        const result = await this.deleteDiseaseUseCase.execute({
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