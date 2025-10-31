import { InMemoryDiseaseRepository } from "test/repositories/in-memory-disease-repository"
import { UpdateDiseaseUseCase } from "./update-disease-use-case"
import { makeDisease } from "test/factories/make-disease"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

describe('UpdateDiseaseUseCase', () => {
    let sut: UpdateDiseaseUseCase
    let inMemoryDiseaseRepository: InMemoryDiseaseRepository

    beforeEach(() => {
        inMemoryDiseaseRepository = new InMemoryDiseaseRepository
        sut = new UpdateDiseaseUseCase(inMemoryDiseaseRepository)
    })

    it('should be able to update a disease', async () => {
        const disease = makeDisease()
        await inMemoryDiseaseRepository.create(disease)

        const response = await sut.execute({
            diseaseId: disease.id.toString(),
            name: 'new-name',
            description: 'new-description'
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.disease.id).toEqual(disease.id)
        expect(response.value.disease.name).toEqual('new-name')
        expect(response.value.disease.description).toEqual('new-description')
    }),

    it('should return null if disease not found', async () => {
        const response = await sut.execute({
            diseaseId: 'invalid-id',
            name: 'new-name',
            description: 'new-description',
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(NotAllowedError)
    })
})