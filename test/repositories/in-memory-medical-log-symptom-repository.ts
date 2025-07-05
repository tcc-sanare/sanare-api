import { MedicalLogSymptomRepository } from "@/domain/medical/application/repositories/medical-log-symptom-repository";
import { MedicalLogSymptom } from "@/domain/medical/enterprise/entities/medical-log-symptom";

export class InMemoryMedicalLogSymptomRepository implements MedicalLogSymptomRepository{
    items: MedicalLogSymptom[]

    constructor() {
        this.items = []
    }

    async createMany(medicalLogSymptoms: MedicalLogSymptom[]): Promise<void> {
        this.items.push(...medicalLogSymptoms)
    }

    async deleteMany(medicalLogSymptoms: MedicalLogSymptom[]): Promise<void> {
        medicalLogSymptoms.forEach(medicalLogSymptom => {
            const index = this.items.findIndex(item => {
                item.medicalLogId === medicalLogSymptom.medicalLogId 
                &&
                item.symptomId === medicalLogSymptom.symptomId
            })

            if(index === -1) return

            this.items.splice(index, 1)
        } )
    }

    async findManyByMedicalLogId(medicalLogId: string): Promise<MedicalLogSymptom[] | null> {
        return this.items.filter(item => item.medicalLogId.toString() === medicalLogId)
    }
    
    async deleteManyByMedicalLogId(medicalLogId: string): Promise<void> {
        this.items = this.items.filter(item => item.medicalLogId.toString() !== medicalLogId)
    }

    async deleteManyByDiseaseId(symptomId: string): Promise<void> {
        this.items = this.items.filter(item => item.symptomId.toString() !== symptomId)
    }
}