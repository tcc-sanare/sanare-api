import { MedicalLogRepository } from "@/domain/medical/application/repositories/medical-log-repository";
import { MedicalLog } from "@/domain/medical/enterprise/entities/medical-log";

export class InMemoryMedicalLogRepository implements MedicalLogRepository{
    items: MedicalLog[]

    constructor() {
        this.items = []
    }

    async create(medicalLog: MedicalLog): Promise<void> {
        this.items.push(medicalLog)
    }

    async save(medicalLog: MedicalLog): Promise<void> {
        const medicalLogIndex = this.items.findIndex(item => item.id === medicalLog.id)

        if(medicalLogIndex === -1) {
            throw new Error('Medical log not found')
        }

        this.items[medicalLogIndex] = medicalLog
    }

    async findById(id: string): Promise<MedicalLog | null> {
        return this.items.find(item => item.id.toString() === id) || null
    }

    async findBySelfMonitorId(selfMonitorId: string): Promise<MedicalLog[] | null> {
        return this.items.map(item => {
            if(item.selfMonitorId.toString() === selfMonitorId) {
                return item
            }
        }) || null
    }

}