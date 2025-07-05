import { InMemorySymptomRepository } from "test/repositories/in-memory-symptom-repositoy"
import { CreateSymptomUseCase } from "./create-symptom-use-case"
import { makeSymptom } from "test/factories/make-symptom"


describe('CreateSymptomUseCase', () => {
    let sut: CreateSymptomUseCase
    let inMemorySymptomRepository: InMemorySymptomRepository

    beforeEach(() => {
        inMemorySymptomRepository = new InMemorySymptomRepository
        sut = new CreateSymptomUseCase(inMemorySymptomRepository)
    })

    it('should be able to create a symptom', async () => {
        const symptom = makeSymptom()

        const response = await sut.execute(symptom)

        expect(response.isRight()).toBeTruthy()
        expect(response.value.symptom.name).toEqual(symptom.name)
        expect(response.value.symptom.description).toEqual(symptom.description)
    })
})