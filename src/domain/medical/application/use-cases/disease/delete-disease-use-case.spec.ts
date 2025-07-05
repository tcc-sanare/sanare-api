import { InMemoryDiseaseRepository } from "test/repositories/in-memory-disease-repositoy"
import { DeleteDiseaseUseCase } from "./delete-disease-use-case"
import { makeDisease } from "test/factories/make-disease"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

describe('DeleteDiseaseUseCase', () => {
    let sut: DeleteDiseaseUseCase
    let inMemoryDiseaseRepository: InMemoryDiseaseRepository

    beforeEach(() => {
        inMemoryDiseaseRepository = new InMemoryDiseaseRepository
        sut = new DeleteDiseaseUseCase(inMemoryDiseaseRepository)
    })

    it('should be able to delete a disease', async () => {
        const disease = makeDisease()
        await inMemoryDiseaseRepository.create(disease)

        const response = await sut.execute({
            diseaseId: disease.id.toString()
        })

        expect(response.isRight()).toBeTruthy()
        if (!response.isRight()) return
        expect(response.value.disease.id).toEqual(disease.id)
        expect(inMemoryDiseaseRepository.items.length).toEqual(0)
    }),

    it('should be able to return null if disease not found', async () => {
        const response = await sut.execute({
            diseaseId: 'invalid-id'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(NotAllowedError)
        if(!response.isLeft()) return
        expect(response.value.props.statusCode).toEqual(400)
    })
})