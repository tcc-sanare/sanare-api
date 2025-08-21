import { MedicalLogDiseaseRepository } from "@/domain/medical/application/repositories/medical-log-disease-repository";
import { MedicalLogDisease } from "@/domain/medical/enterprise/entities/medical-log-disease";
import { MedicalLogsToDiseases } from "@prisma/client";

export class InMemoryMedicalLogDiseaseRepository implements MedicalLogDiseaseRepository{
    items: MedicalLogDisease[]

    constructor() {
        this.items = []
    }

    async createMany(medicalLogDiseases: MedicalLogDisease[]): Promise<void> {
        this.items.push(...medicalLogDiseases)
    }

    async deleteMany(medicalLogDiseases: MedicalLogDisease[]): Promise<void> {
        medicalLogDiseases.forEach(medicalLogDisease => {
            const index = this.items.findIndex(item => {
                item.medicalLogId === medicalLogDisease.medicalLogId
                &&
                item.diseaseId === medicalLogDisease.diseaseId
            })

            if(index === -1) return

            this.items.splice(index, 1)
        })
    }

    async findManyByMedicalLogId(medicalLogId: string): Promise<MedicalLogDisease[] | null> {
        return this.items.filter(item => item.medicalLogId.toString() === medicalLogId)
    }

    async deleteManyByMedicalLogId(medicalLogId: string): Promise<void> {
        this.items = this.items.filter(item => {
            item.medicalLogId.toString() !== medicalLogId
        })        
    }

    async deleteManyByDiseaseId(diseaseId: string): Promise<void> {
        this.items = this.items.filter(item => {
            item.diseaseId.toString() !== diseaseId
        })
    }


}