import { InMemoryMedicalLogRepository } from "test/repositories/in-memory-medical-log-repository"
import { CreateMedicalLogUseCase } from "./create-medical-log-use-case"
import { makeMedicalLog } from "test/factories/make-medical-log"

describe('CreateMedicalLogUseCase', () => {
    let sut: CreateMedicalLogUseCase
    let inMemoryMedicalLogRepository: InMemoryMedicalLogRepository

    beforeEach(() => {
        inMemoryMedicalLogRepository = new InMemoryMedicalLogRepository
        sut = new CreateMedicalLogUseCase(inMemoryMedicalLogRepository)
    })

    it('should create a medical log', async () => {
        const medicalLog = makeMedicalLog()

        const response = await sut.execute({
            selfMonitorId: medicalLog.selfMonitorId.toString(),
            bloodPressure: medicalLog.bloodPressure,
            heartRate: medicalLog.hearthRate,
            mood: medicalLog.mood,
            hydratation: medicalLog.hydratation,
            bloodSugar: medicalLog.bloodSugar,
            
            diseases: ['a'],
            symptoms: ['b']
        })
        

        expect(response.isRight()).toBeTruthy()
        if(!response.isRight()) return
        expect(response.value.medicalLog.selfMonitorId).toEqual(medicalLog.selfMonitorId)
        expect(response.value.medicalLog.bloodPressure).toEqual(medicalLog.bloodPressure)
        expect(response.value.medicalLog.bloodSugar).toEqual(medicalLog.bloodSugar)
        expect(response.value.medicalLog.hearthRate).toEqual(medicalLog.hearthRate)
        expect(response.value.medicalLog.mood).toEqual(medicalLog.mood)
        expect(response.value.medicalLog.hydratation).toEqual(medicalLog.hydratation)
        
    })
})