import { AllergyType as PrismaAllergyType, Prisma, Allergies as PrismaAllergy } from "@prisma/client";
import { Allergy, AllergyType } from "@/domain/medical/enterprise/entities/allergy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaAllergyMapper {
  static toDomain(raw: PrismaAllergy): Allergy {
    return Allergy.create({
      name: raw.name,
      type: raw.type.toLowerCase().replace('_', '-') as AllergyType,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(allergy: Allergy): Prisma.AllergiesUncheckedCreateInput {
    return {
      id: allergy.id.toString(),
      name: allergy.name,
      type: allergy.type.toUpperCase().replace('-', '_') as PrismaAllergyType,
      createdAt: allergy.createdAt,
      updatedAt: allergy.updatedAt,
    };
  }
}