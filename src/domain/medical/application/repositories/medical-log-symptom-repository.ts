import { MedicalLogSymptom } from "../../enterprise/entities/medical-log-symptom";

export abstract class MedicalLogSymptomRepository{
    abstract createMany(medicalLogSymptoms: MedicalLogSymptom[]): Promise<void>
    abstract deleteMany(medicalLogSymptoms: MedicalLogSymptom[]): Promise<void>
    abstract findManyByMedicalLogId(medicalLogId: string): Promise<MedicalLogSymptom[] | null>
    abstract deleteManyByMedicalLogId(medicalLogId: string): Promise<void>
    abstract deleteManyByDiseaseId(symptomId: string): Promise<void>
}