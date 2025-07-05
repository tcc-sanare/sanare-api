import { InMemoryDiseaseRepository } from "test/repositories/in-memory-disease-repositoy"
import { GetAllDiseasesUseCase } from "./get-all-disease-use-case"
import { makeDisease } from "test/factories/make-disease"

describe('GetAllDiseaseUseCase', () => {
    let sut: GetAllDiseasesUseCase
    let inMemoryDiseaseRepository: InMemoryDiseaseRepository

    beforeEach(() => {
        inMemoryDiseaseRepository = new InMemoryDiseaseRepository
        sut = new GetAllDiseasesUseCase(inMemoryDiseaseRepository)
    })

    it('should be able to return all diseases', async () => {
        const disease1 = makeDisease()
        const disease2 = makeDisease()

        await inMemoryDiseaseRepository.create(disease1)
        await inMemoryDiseaseRepository.create(disease2)

        const response = sut.execute()

        expect((await response).isRight()).toBeTruthy()
        expect((await response).value.diseases).toHaveLength(2)
    }),

    it('should be able to return an empty array if no disease is found', async () => {
        const response = await sut.execute()

        expect(response.isRight()).toBeTruthy()
        expect(response.value.diseases).toHaveLength(0)
    })
})