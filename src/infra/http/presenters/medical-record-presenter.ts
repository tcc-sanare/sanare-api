import { MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";

export class MedicalRecordPresenter{
    static toHttp(medicalRecord: MedicalRecord) {
        return {
            id: medicalRecord.id.toString(),
            bloodType: medicalRecord.bloodType,
            allergies: medicalRecord.allergies.currentItems.map(allergy => allergy.allergyId.toString()),
            chronicDiseases: medicalRecord.chronicDiseases.currentItems.map(chronicDisease => chronicDisease.chronicDiseaseId.toString()),
            selfMonitorId: medicalRecord.selfMonitorId.toString(),
            createdAt: medicalRecord.createdAt
        }
    }
}