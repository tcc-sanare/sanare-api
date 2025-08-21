import { MedicalLog } from "@/domain/medical/enterprise/entities/medical-log";

export class MedicalLogPresenter {
    static toHttp(medicalLog: MedicalLog) {
        return {
            id: medicalLog.id.toString(),
            selfMonitorId: medicalLog.selfMonitorId.toString(),
            bloodPressure: medicalLog.bloodPressure,
            heartRate: medicalLog.hearthRate,
            mood: medicalLog.mood,
            hydratation: medicalLog.hydratation,
            bloodSugar: medicalLog.bloodSugar,
            symptoms: medicalLog.symptoms.currentItems,
            diseases: medicalLog.diseases.currentItems,
            createdAt: medicalLog.createdAt,
        }

    }
}