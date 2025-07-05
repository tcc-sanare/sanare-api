import { DeleteSymptomUseCase } from "@/domain/medical/application/use-cases/symptom/delete-symptom-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { SymptomPresenter } from "@/infra/http/presenters/symptom-presenter";
import { Controller, Delete, Param } from "@nestjs/common";

@Controller("symptoms")
export class DeleteSymptomController{
    constructor(
        private deleteSymptomUseCase: DeleteSymptomUseCase
    ) {}

    @Delete(':id')
    async handle(
        @Param('id') id: string
    ) {
        const result = await this.deleteSymptomUseCase.execute({
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