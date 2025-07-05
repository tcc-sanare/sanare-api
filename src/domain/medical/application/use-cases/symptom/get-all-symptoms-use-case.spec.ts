import { makeSymptom } from "test/factories/make-symptom"
import { GetAllSymptomsUseCase } from "./get-all-symptoms-use-case"
import { InMemorySymptomRepository } from "test/repositories/in-memory-symptom-repositoy"

describe('GetAllSymptomsUseCase', () => {
    let sut: GetAllSymptomsUseCase
    let inMemorySymptomRepository: InMemorySymptomRepository

    beforeEach(() => {
        inMemorySymptomRepository = new InMemorySymptomRepository
        sut = new GetAllSymptomsUseCase(inMemorySymptomRepository)
    })

    it('should return all symptoms', async () => {
        const symptom1 = makeSymptom()
        const symptom2 = makeSymptom()

        await inMemorySymptomRepository.create(symptom1)
        await inMemorySymptomRepository.create(symptom2)

        const response = await sut.execute()

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.symptoms).toHaveLength(2)
        expect(response.value.symptoms).toEqual(inMemorySymptomRepository.items)
    }),
    
    it('should return an empty array if there are no symptoms', async () => {
        const response = await sut.execute()

        expect(response.isRight()).toBeTruthy()
        expect(response.value.symptoms).toHaveLength(0)
        expect(response.value.symptoms).toEqual(inMemorySymptomRepository.items)
    })
})