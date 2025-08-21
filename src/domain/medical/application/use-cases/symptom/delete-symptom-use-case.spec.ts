import { makeSymptom } from "test/factories/make-symptom"
import { InMemorySymptomRepository } from "test/repositories/in-memory-symptom-repositoy"
import { DeleteSymptomUseCase } from "./delete-symptom-use-case"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

describe('DeleteSymptomUseCase', () => {
    let sut: DeleteSymptomUseCase
    let inMemorySymptomRepository: InMemorySymptomRepository

    beforeEach(() => {
        inMemorySymptomRepository = new InMemorySymptomRepository
        sut = new DeleteSymptomUseCase(inMemorySymptomRepository)
    })

    it('should be able to delete a symptom', async () => {
        const symptom = makeSymptom()

        await inMemorySymptomRepository.create(symptom)

        const response = await sut.execute({
            symptomId: symptom.id.toString()
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.symptom.id).toEqual(symptom.id)
        expect(inMemorySymptomRepository.items.length).toEqual(0)
    }),
    it('should return null if symptom not found', async () => {
        const response = await sut.execute({
            symptomId: 'invalid-id'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(NotAllowedError)
    })
})