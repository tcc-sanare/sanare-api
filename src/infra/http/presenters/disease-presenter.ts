import { Disease } from "@/domain/medical/enterprise/entities/disease";

export interface DiseaseToHttp {
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}

export class DiseasePresenter {
    static toHttp(disease: Disease) {
        return {
            id: disease.id.toString(),
            name: disease.name,
            description: disease.description,
            createdAt: disease.createdAt,
            updatedAt: disease.updatedAt
        }
    }
}