import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Symptom } from "@/domain/medical/enterprise/entities/symptom"
import { Injectable } from "@nestjs/common"
import { SymptomRepository } from "../../repositories/symptom-repository"

interface UpdateSymptomUseCaseRequest{
    symptomId: string,
    name?: string,
    description?: string
}

type UpdateSymptomUseCaseResponse = Either<
    NotAllowedError<UpdateSymptomUseCaseRequest>,
    {
        symptom: Symptom
    }
>

@Injectable()
export class UpdateSymptomUsecase{
    constructor(
        private symptomRepository: SymptomRepository
    ) {}

    async execute(request: UpdateSymptomUseCaseRequest): Promise<UpdateSymptomUseCaseResponse> {
        const symptom = await this.symptomRepository.findById(request.symptomId)

        if(!symptom) {
            return left(new NotAllowedError<UpdateSymptomUseCaseRequest>({
                statusCode: 400,
                errors: [
                    {
                        message: 'Doença não encontrada'
                    }
                ]
            }))
        }

        request.name  && (symptom.name = request.name)
        request.description && (symptom.description = request.description)

        await this.symptomRepository.save(symptom)

        return right({ symptom })
    }
}