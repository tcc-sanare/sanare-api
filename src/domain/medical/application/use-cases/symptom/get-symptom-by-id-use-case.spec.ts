import { makeSymptom } from "test/factories/make-symptom"
import { InMemorySymptomRepository } from "test/repositories/in-memory-symptom-repositoy"
import { GetSymptomByIdUseCase } from "./get-symptom-by-id-use-case"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

describe('GetSymptomByIdUseCase', () => {
    let sut: GetSymptomByIdUseCase
    let inMemorySymptomRepository: InMemorySymptomRepository

    beforeEach(() => {
        inMemorySymptomRepository = new InMemorySymptomRepository
        sut = new GetSymptomByIdUseCase(inMemorySymptomRepository)
    })

    it('should return a sympotm', async () => {
        const symptom = makeSymptom()
        await inMemorySymptomRepository.create(symptom)

        const response = await sut.execute({
            symptomId: symptom.id.toString()
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.symptom.id).toEqual(symptom.id)
        expect(response.value.symptom.name).toEqual(symptom.name)
        expect(response.value.symptom.description).toEqual(symptom.description)
    }),
    it('should return null if symptom not found', async () => {
        const response = await sut.execute({
            symptomId: 'invalid-id'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    })
})