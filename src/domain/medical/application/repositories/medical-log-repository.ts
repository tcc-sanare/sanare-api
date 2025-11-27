import { MedicalLog } from "../../enterprise/entities/medical-log";

export abstract class MedicalLogRepository{
    abstract create(medicalLog: MedicalLog): Promise<void>
    // abstract delete(medicalLog: MedicalLog): Promise<void>
    abstract save(medicalLog: MedicalLog): Promise<void>
    abstract findById(id: string): Promise<MedicalLog | null>
    abstract findBySelfMonitorId(selfMonitorId: string, date?: { from?: Date; to?: Date }): Promise<MedicalLog[] | null>
}