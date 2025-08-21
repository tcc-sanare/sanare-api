import { Symptom } from "@/domain/medical/enterprise/entities/symptom";


export class SymptomPresenter {
    static toHttp(symptom: Symptom) {
        return {
            id: symptom.id.toString(),
            name: symptom.name,
            description: symptom.description,
            createdAt: symptom.createdAt,
            updatedAt: symptom.updatedAt
        }
    }
}