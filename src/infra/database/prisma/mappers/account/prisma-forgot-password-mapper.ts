import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ForgotPassword } from "@/domain/account/user/enterprise/entities/forgot-password"
import { UniqueForgotPasswordCode } from "@/domain/account/user/enterprise/entities/value-object/unique-forgot-password-code"
import { VerificationCodes } from "@prisma/client"

export class PrismaForgotPasswordMapper {
  static toDomain(raw: VerificationCodes): ForgotPassword {
    return ForgotPassword.create({
      accountId: new UniqueEntityID(raw.userId),
      code: new UniqueForgotPasswordCode(raw.code),
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(entity: ForgotPassword): VerificationCodes {
    return {
      id: entity.id.toString(),
      userId: entity.accountId.toString(),
      code: entity.code.toValue(),
      type: 'PASSWORD',
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}