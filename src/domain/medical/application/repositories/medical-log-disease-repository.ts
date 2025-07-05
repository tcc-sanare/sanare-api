import { MedicalLogDisease } from "../../enterprise/entities/medical-log-disease";


export abstract class MedicalLogDiseaseRepository{
    abstract createMany(medicalLogDiseases: MedicalLogDisease[]): Promise<void>
    abstract deleteMany(medicalLogDiseases: MedicalLogDisease[]): Promise<void>
    abstract findManyByMedicalLogId(medicalLogId: string): Promise<MedicalLogDisease[] | null>
    abstract deleteManyByMedicalLogId(medicalLogId: string): Promise<void>
    abstract deleteManyByDiseaseId(diseaseId: string): Promise<void>
}