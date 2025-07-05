import { makeDisease } from "test/factories/make-disease"
import { GetDiseasesByNameUseCase } from "./get-diseases-by-name-use-case"
import { InMemoryDiseaseRepository } from "test/repositories/in-memory-disease-repository"

describe('GetDiseasesByNameUseCase', () => {
    let sut: GetDiseasesByNameUseCase
    let inMemoryDiseaseRepository: InMemoryDiseaseRepository

    beforeEach(() => {
        inMemoryDiseaseRepository = new InMemoryDiseaseRepository
        sut = new GetDiseasesByNameUseCase(inMemoryDiseaseRepository)
    })

    it('should be able to return one disease', async () => {
        const disease1 = makeDisease()
        const disease2 = makeDisease({
            name: 'another-name'
        })

        await inMemoryDiseaseRepository.create(disease1)
        await inMemoryDiseaseRepository.create(disease2)

        const response = await sut.execute({
            diseaseName: disease1.name.substring(0, 3)
        })

        expect(response.isRight()).toBeTruthy()
        expect(response.value.diseases.length).toEqual(1)
        // expect(inMemoryDiseaseRepository.items.length).toHaveLength(2)
        expect(response.value.diseases[0].id).toEqual(disease1.id)
    }),

    it('should be able to return an empty array if no disease is found', async () => {
        const response = await sut.execute({diseaseName: 'invalid-name'})

        expect(response.isRight()).toBeTruthy()
        expect(response.value.diseases).toHaveLength(0)

    })
})