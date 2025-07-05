import { Symptom } from "../../enterprise/entities/symptom";

export abstract class SymptomRepository{
    abstract create(symptom: Symptom): Promise<void>
    abstract delete(symptom: Symptom): Promise<void>
    abstract save(symptom: Symptom): Promise<void>
    abstract findById(id: string): Promise<Symptom | null>
    abstract findByName(name: string): Promise<Symptom[] | null>
    abstract findAll(): Promise<Symptom[] | null>
}