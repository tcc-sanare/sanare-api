import { Either, right } from "@/core/either"
import { Disease } from "@/domain/medical/enterprise/entities/disease"
import { Injectable } from "@nestjs/common"
import { DiseaseRepository } from "../../repositories/disease-repository"

interface CreateDiseaseUseCaseRequest{
    name: string,
    description?: string
}

type CreateDiseaseUseCaseResponse = Either<
    null,
    {
        disease: Disease
    }
>

@Injectable()
export class CreateDiseaseUseCase {
    constructor(
        private diseaseRepository: DiseaseRepository
    ) {}

    async execute(
        data: CreateDiseaseUseCaseRequest
    ): Promise<CreateDiseaseUseCaseResponse> {
        const disease = Disease.create({
            name: data.name,
            description: data.description
        })

        await this.diseaseRepository.create(disease)
        return right({ disease })
    }
}