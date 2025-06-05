import { Prisma, ChronicDiseases as PrismaChronicDisease } from "@prisma/client";
import { ChronicDisease } from "@/domain/medical/enterprise/entities/chronic-disease";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaChronicDiseaseMapper {
  static toDomain(raw: PrismaChronicDisease): ChronicDisease {
    return ChronicDisease.create({
      name: raw.name,
      description: raw.description,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(chronicDisease: ChronicDisease): Prisma.ChronicDiseasesUncheckedCreateInput {
    return {
      id: chronicDisease.id.toString(),
      name: chronicDisease.name,
      description: chronicDisease.description,
      createdAt: chronicDisease.createdAt,
      updatedAt: chronicDisease.updatedAt,
    };
  }
}