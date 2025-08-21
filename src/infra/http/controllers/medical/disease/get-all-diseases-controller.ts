import { GetAllDiseasesUseCase } from "@/domain/medical/application/use-cases/disease/get-all-disease-use-case";
import { GetDiseasesByNameUseCase } from "@/domain/medical/application/use-cases/disease/get-diseases-by-name-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { DiseasePresenter } from "@/infra/http/presenters/disease-presenter";
import { Controller, Get, Query } from "@nestjs/common";
import { response } from "express";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const querySchema = z.object({
    name: z.string().optional()
}).openapi('query')

class QueryDto extends createZodDto(querySchema) {}

const queryValidation = new ZodValidationPipe(querySchema)

@Controller("diseases")
export class GetAllDiseasesController{
    constructor(
        private getAllDiseasesUseCase: GetAllDiseasesUseCase,
        private getDiseasesByNameUseCase: GetDiseasesByNameUseCase
    ) {}

    @Get()
    async handle(
        @Query(queryValidation) { name }: QueryDto
    ) {
        if(!name) {
            const result = await this.getAllDiseasesUseCase.execute()
            .then(res => {
                if(res.isLeft()) throw new CustomHttpException(res.value)
                return res.value.diseases
            })

            return {
                diseases: result.map(DiseasePresenter.toHttp)
            }
        }

        const result = await this.getDiseasesByNameUseCase.execute({
            diseaseName: name
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.diseases
        })
        
        return {
            diseases: result.map(DiseasePresenter.toHttp)
        }

       
    }
}