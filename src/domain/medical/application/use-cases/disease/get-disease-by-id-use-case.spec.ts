import { InMemoryDiseaseRepository } from "test/repositories/in-memory-disease-repositoy"
import { GetDiseaseByIdUseCase } from "./get-disease-by-id-use-case"
import { makeDisease } from "test/factories/make-disease"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

describe('GetDiseaseByIdUseCase', () => {
    let sut: GetDiseaseByIdUseCase
    let inMemoryDiseaseRepository: InMemoryDiseaseRepository

    beforeEach(() => {
        inMemoryDiseaseRepository = new InMemoryDiseaseRepository
        sut = new GetDiseaseByIdUseCase(inMemoryDiseaseRepository)
    })

    it('should be abel to return a disease', async () => {
        const disease = makeDisease()

        await inMemoryDiseaseRepository.create(disease)

        const response = await sut.execute({ diseaseId: disease.id.toString()})

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.disease.id).toEqual(disease.id)
        expect(response.value.disease.name).toEqual(disease.name)
        expect(response.value.disease.description).toEqual(disease.description)
    }),

    it('should be able to return null if disease not found', async () => {
        const response = await sut.execute({
            diseaseId: 'invalid-name'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    })
})