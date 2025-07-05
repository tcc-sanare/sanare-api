import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { makeSymptom } from "test/factories/make-symptom"
import { InMemorySymptomRepository } from "test/repositories/in-memory-symptom-repositoy"
import { UpdateSymptomUsecase } from "./update-symptom-use-case"

describe('UpdateSymptomUseCase', () => {
    let sut: UpdateSymptomUsecase
    let inMemorySymptomRepository: InMemorySymptomRepository

    beforeEach(() => {
        inMemorySymptomRepository = new InMemorySymptomRepository
        sut = new UpdateSymptomUsecase(inMemorySymptomRepository)
    })

    it('should update a symptom', async () => {
        const symptom = makeSymptom()

        await inMemorySymptomRepository.create(symptom)

        const response = await sut.execute({
            symptomId: symptom.id.toString(),
            name: 'new-name',
            description: 'new-description'
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.symptom.id).toEqual(symptom.id)
        expect(response.value.symptom.name).toEqual('new-name')
        expect(response.value.symptom.description).toEqual('new-description')
    }),
    it('should return null if symptom not found', async () => {
        const response = await sut.execute({
            symptomId: 'invalid-id'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(NotAllowedError)
    })
})