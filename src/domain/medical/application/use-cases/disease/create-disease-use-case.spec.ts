import { InMemoryDiseaseRepository } from "test/repositories/in-memory-disease-repository"
import { CreateDiseaseUseCase } from "./create-disease-use-case"
import { makeDisease } from "test/factories/make-disease"

describe('CreateDiseaseUseCase', () => {
    let sut: CreateDiseaseUseCase
    let inMemoryDiseaseRepository: InMemoryDiseaseRepository

    beforeEach(() => {
        inMemoryDiseaseRepository = new InMemoryDiseaseRepository
        sut = new CreateDiseaseUseCase(inMemoryDiseaseRepository)
    })

    it('should be able to create a disease', async () => {
        const disease = makeDisease()

        const response = await sut.execute(disease)

        expect(response.isRight()).toBeTruthy()
        expect(response.value.disease.id).toBeTruthy()
        expect(response.value.disease.name).toEqual(disease.name)
        expect(response.value.disease.description).toEqual(disease.description)
        expect(inMemoryDiseaseRepository.items.length).toEqual(1)
    })
})