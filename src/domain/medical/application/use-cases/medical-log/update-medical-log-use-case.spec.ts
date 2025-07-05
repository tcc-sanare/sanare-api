import { InMemoryMedicalLogRepository } from "test/repositories/in-memory-medical-log-repository"
import { UpdateMedicalLogUseCase } from "./update-medical-log-use-case"
import { makeMedicalLog } from "test/factories/make-medical-log"
import { MedicalLogDisease } from "@/domain/medical/enterprise/entities/medical-log-disease"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

describe('UpdateMedicalLogUseCase', () => {
    let sut: UpdateMedicalLogUseCase
    let inMemoryMedicalLogRepository: InMemoryMedicalLogRepository

    beforeEach(() => {
        inMemoryMedicalLogRepository = new InMemoryMedicalLogRepository
        sut = new UpdateMedicalLogUseCase(inMemoryMedicalLogRepository)
    })

    it('should update a medical log', async () => {
        const medicalLog = makeMedicalLog()

        await inMemoryMedicalLogRepository.create(medicalLog)

        const response = await sut.execute({
            medicalLogId: medicalLog.id.toString(),
            bloodPressure: '200/100',
            heartRate: 100
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.medicalLog.bloodPressure).toEqual('200/100')
        expect(response.value.medicalLog.hearthRate).toEqual(100)
    }),

    it('should remove symptoms and diseases if they are not provided', async () => {
        const medicalLog = makeMedicalLog()
        medicalLog.diseases.add(
            MedicalLogDisease.create({
                medicalLogId: medicalLog.id,
                diseaseId: new UniqueEntityID('b')
            })
        )

        inMemoryMedicalLogRepository.create(medicalLog)

        const response = await sut.execute({
            medicalLogId: medicalLog.id.toString(),
            diseases: []
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.medicalLog.diseases.currentItems).toHaveLength(0)
        expect(response.value.medicalLog.symptoms.currentItems).toHaveLength(0)
        expect(inMemoryMedicalLogRepository.items[0].diseases.currentItems).toHaveLength(0)
    }),

    it('should not update a medical log if it does not exist', async () => {
        const response = await sut.execute({
            medicalLogId: 'invalid-id',
            bloodPressure : 'non-existing-blood-pressure'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(NotAllowedError)
    })
})