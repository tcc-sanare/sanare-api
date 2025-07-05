import { makeSymptom } from "test/factories/make-symptom"
import { InMemorySymptomRepository } from "test/repositories/in-memory-symptom-repositoy"
import { GetSymptomByNameUseCase } from "./get-symptoms-by-name-use-case"


describe('GetSymptomsByNameUseCase', () => {
    let sut: GetSymptomByNameUseCase
    let inMemorySymptomRepository: InMemorySymptomRepository

    beforeEach(() => {
        inMemorySymptomRepository = new InMemorySymptomRepository
        sut = new GetSymptomByNameUseCase(inMemorySymptomRepository)
    })

    it('should return one symptom', async () => {
        const symptom1 = makeSymptom()
        const symptom2 = makeSymptom()

        await inMemorySymptomRepository.create(symptom1)
        await inMemorySymptomRepository.create(symptom2)

        const response = await sut.execute({
            symptomName: symptom1.name
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.symptoms[0].id).toEqual(symptom1.id)
        expect(response.value.symptoms[0].name).toEqual(symptom1.name)
        expect(response.value.symptoms[0].description).toEqual(symptom1.description)
    }),

    it('should return  two symptoms', async () => {
        const symptom1 = makeSymptom()
        const symptom2 = makeSymptom({name: symptom1.name.substring(0, symptom1.name.length - 1)})

        await inMemorySymptomRepository.create(symptom1)
        await inMemorySymptomRepository.create(symptom2)

        const response = await sut.execute({
            symptomName: symptom1.name.substring(0, 3)
        })

        expect(response.isRight()).toBeTruthy()
        expect(response.value.symptoms).toHaveLength(2)
        expect(response.value.symptoms[0].id).toEqual(symptom1.id)
        expect(response.value.symptoms[1].id).toEqual(symptom2.id)
    }),

    it('should return an empty array if no symptom is found', async () => {
        const response = await sut.execute({
            symptomName: 'invalid-name'
        })

        expect(response.isRight()).toBeTruthy()
        expect(response.value.symptoms).toHaveLength(0)
    })
})