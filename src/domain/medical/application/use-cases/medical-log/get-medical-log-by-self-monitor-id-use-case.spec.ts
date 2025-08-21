import { InMemoryMedicalLogRepository } from "test/repositories/in-memory-medical-log-repository"
import { GetMedicalLogBySelfMonitorIdUseCase } from "./get-medical-log-by-self-monitor-id-use-case"
import { makeMedicalLog } from "test/factories/make-medical-log"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

describe('GetMedicalLogBySelfMonitorIdUseCase', () => {
    let sut: GetMedicalLogBySelfMonitorIdUseCase
    let inMemoryMedicalLogRepository: InMemoryMedicalLogRepository

    beforeEach(() => {
        inMemoryMedicalLogRepository = new InMemoryMedicalLogRepository
        sut = new GetMedicalLogBySelfMonitorIdUseCase(inMemoryMedicalLogRepository)
    })

    it('should return a medical log by self monitor id', async () => {
        const medicalLog1 = makeMedicalLog()
        const medicalLog2 = makeMedicalLog({
            selfMonitorId: medicalLog1.selfMonitorId
        })

        await inMemoryMedicalLogRepository.create(medicalLog1)
        await inMemoryMedicalLogRepository.create(medicalLog2)

        const response = await sut.execute({
            selfMonitorId: medicalLog1.selfMonitorId.toString()
        })

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.medicalLogs).toHaveLength(2)
        expect(response.value.medicalLogs[0].id).toEqual(medicalLog1.id)
        expect(response.value.medicalLogs[0].selfMonitorId).toEqual(medicalLog1.selfMonitorId)
        expect(response.value.medicalLogs[0]).toEqual(medicalLog1)

        expect(response.value.medicalLogs[1].id).toEqual(medicalLog2.id)
        expect(response.value.medicalLogs[1].selfMonitorId).toEqual(medicalLog2.selfMonitorId)
        expect(response.value.medicalLogs[1]).toEqual(medicalLog2)
        
    }),

    it('should not get a medical log by an invalid self monitor id', async () => {
        const response = await sut.execute({
            selfMonitorId: 'invalid-id'
        })

        expect(response.isLeft()).toBeTruthy()
        expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    })

})