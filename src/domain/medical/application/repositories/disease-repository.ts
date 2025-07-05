import { Disease } from "../../enterprise/entities/disease";

export abstract class DiseaseRepository{
    abstract create(disease: Disease): Promise<void>
    abstract save(disease: Disease): Promise<void>
    abstract delete(disease: Disease): Promise<void>
    abstract findById(id: string): Promise<Disease | null>
    abstract findByName(name: string): Promise<Disease[] | null>
    abstract findAll(): Promise<Disease[] | null>
}