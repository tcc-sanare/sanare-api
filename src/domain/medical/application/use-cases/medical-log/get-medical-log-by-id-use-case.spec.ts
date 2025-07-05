import { InMemoryMedicalLogRepository } from "test/repositories/in-memory-medical-log-repository"
import { GetMedicalLogByIdUseCase } from "./get-medical-log-by-id-use-case"
import { makeMedicalLog } from "test/factories/make-medical-log"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

describe('GetMedicalLogByIdUseCase', () => {
    let sut: GetMedicalLogByIdUseCase
    let inMemoryMedicalLogRepository: InMemoryMedicalLogRepository

    beforeEach(() => {
        inMemoryMedicalLogRepository = new InMemoryMedicalLogRepository
        sut = new GetMedicalLogByIdUseCase(inMemoryMedicalLogRepository)
    })

    it('should return a medical log', async () => {
        const medicalLog = makeMedicalLog()

        await inMemoryMedicalLogRepository.create(medicalLog)

        const response = await sut.execute({
            medicalLogId: medicalLog.id.toString()
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.medicalLog.id).toEqual(medicalLog.id)
        expect(response.value.medicalLog.bloodPressure).toEqual(medicalLog.bloodPressure)
        expect(response.value.medicalLog.bloodSugar).toEqual(medicalLog.bloodSugar)
        expect(response.value.medicalLog.hearthRate).toEqual(medicalLog.hearthRate)
        expect(response.value.medicalLog.hydratation).toEqual(medicalLog.hydratation)
        expect(response.value.medicalLog.selfMonitorId).toEqual(medicalLog.selfMonitorId)
    }),

    it('should return null if medical log not found', async () => {
        const response = await sut.execute({
            medicalLogId: 'invalid-id'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    })
})