import { GetAllDiseasesUseCase } from "@/domain/medical/application/use-cases/disease/get-all-disease-use-case";
import { GetDiseasesByNameUseCase } from "@/domain/medical/application/use-cases/disease/get-diseases-by-name-use-case";
import { GetAllSymptomsUseCase } from "@/domain/medical/application/use-cases/symptom/get-all-symptoms-use-case";
import { GetSymptomByNameUseCase } from "@/domain/medical/application/use-cases/symptom/get-symptoms-by-name-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { DiseasePresenter } from "@/infra/http/presenters/disease-presenter";
import { SymptomPresenter } from "@/infra/http/presenters/symptom-presenter";
import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const querySchema = z.object({
    name: z.string().optional()
}).openapi('query')

class QueryDto extends createZodDto(querySchema) {}

const queryValidation = new ZodValidationPipe(querySchema)

@Controller("symptoms")
export class GetAllSymptomsController{
    constructor(
        private getAllSymptomsUseCase: GetAllSymptomsUseCase,
        private getSymptomsByNameUseCase: GetSymptomByNameUseCase
    ) {}

    @Get()
    async handle(
        @Query(queryValidation) { name }: QueryDto
    ) {
        if(!name) {
            const result = await this.getAllSymptomsUseCase.execute()
            .then(res => {
                if(res.isLeft()) throw new CustomHttpException(res.value)
                return res.value.symptoms
            })

            return {
                symptoms: result.map(SymptomPresenter.toHttp)
            }
        }

        const result = await this.getSymptomsByNameUseCase.execute({
            symptomName: name
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.symptoms
        })
        
        return {
            symptoms: result.map(SymptomPresenter.toHttp)
        }

       
    }
}