import { Prisma, Allergies as PrismaAllergy } from "@prisma/client";
import { Allergy } from "@/domain/medical/enterprise/entities/allergy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaAllergyMapper {
  static toDomain(raw: PrismaAllergy): Allergy {
    return Allergy.create({
      name: raw.name,
      description: raw.description,
      iconKey: raw.iconKey,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(allergy: Allergy): Prisma.AllergiesUncheckedCreateInput {
    return {
      id: allergy.id.toString(),
      name: allergy.name,
      description: allergy.description,
      iconKey: allergy.iconKey,
      createdAt: allergy.createdAt,
      updatedAt: allergy.updatedAt,
    };
  }
}