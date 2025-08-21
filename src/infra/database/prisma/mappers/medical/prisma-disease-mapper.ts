import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Disease } from "@/domain/medical/enterprise/entities/disease";
import { Diseases, Prisma } from "@prisma/client";

export class PrismaDiseaseMapper{
    static toDomain(raw: Diseases): Disease {
        return Disease.create({
            name: raw.name,
            description: raw.description,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(disease: Disease): Prisma.DiseasesUncheckedCreateInput {
        return {
            id: disease.id.toString(),
            name: disease.name,
            description: disease.description,
            createdAt: disease.createdAt,
            updatedAt: disease.updatedAt
        }
    }
}