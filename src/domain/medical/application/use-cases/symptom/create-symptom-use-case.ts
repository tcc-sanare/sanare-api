import { Either, right } from "@/core/either"
import { Symptom } from "@/domain/medical/enterprise/entities/symptom"
import { Injectable } from "@nestjs/common"
import { SymptomRepository } from "../../repositories/symptom-repository"

interface CreateSymptomUseCaseRequest{
    name: string,
    description: string
}

type CreateSymptomUseCaseResponse = Either<
    null,
    {
        symptom: Symptom
    }
>

@Injectable()
export class CreateSymptomUseCase{
    constructor(
        private symptomRepository: SymptomRepository
    ) {}

    async execute(request: CreateSymptomUseCaseRequest): Promise<CreateSymptomUseCaseResponse> {
        const symptom = Symptom.create({
            name: request.name,
            description: request.description
        })

        await this.symptomRepository.create(symptom)
        return right({symptom})
    }
}