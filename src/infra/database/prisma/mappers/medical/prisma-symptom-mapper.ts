import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Disease } from "@/domain/medical/enterprise/entities/disease";
import { Symptom } from "@/domain/medical/enterprise/entities/symptom";
import { Prisma, Symptoms } from "@prisma/client";

export class PrismaSymptomMapper{
    static toDomain(raw: Symptoms): Symptom {
        return Symptom.create({
            name: raw.name,
            description: raw.description,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(symptom: Symptom): Prisma.SymptomsUncheckedCreateInput {
        return {
            id: symptom.id.toString(),
            name: symptom.name,
            description: symptom.description,
            createdAt: symptom.createdAt,
            updatedAt: symptom.updatedAt
        }
    }
}