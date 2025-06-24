import { DeleteAllergyUseCase } from "@/domain/medical/application/use-cases/allergy/delete-allergy-use-case";
import { GetAllergyByIdUseCase } from "@/domain/medical/application/use-cases/allergy/get-allergy-by-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AllergyPresenter } from "@/infra/http/presenters/allergy-presenter";
import { Controller, Delete, Param } from "@nestjs/common";

@Controller('allergies')
export class DeleteAllergyController{
    constructor(
        private deleteAllergy: DeleteAllergyUseCase,
        // private getAllergy: GetAllergyByIdUseCase
    ) {}
    @Delete(':id')
    async handle(@Param('id') id: string) {
        const result = await this.deleteAllergy.execute({
            allergyId: id
        })
        .then(res => {
            if (res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.allergy
        })

        return;
    }

}