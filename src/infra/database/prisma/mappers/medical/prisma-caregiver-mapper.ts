import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";
import { Prisma, Caregiver as PrismaCaregiver } from "@prisma/client";

export class PrismaCaregiverMapper {
  static toDomain(raw: PrismaCaregiver): Caregiver {
    return Caregiver.create({
      userId: new UniqueEntityID(raw.userId),
      code: new UniqueCaregiverCode(raw.code),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(caregiver: Caregiver): Prisma.CaregiverUncheckedCreateInput {
    return {
      id: caregiver.id.toString(),
      userId: caregiver.userId.toString(),
      code: caregiver.code.toValue(),
      createdAt: caregiver.createdAt,
      updatedAt: caregiver.updatedAt,
    };
  }
}