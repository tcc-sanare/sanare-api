import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EmailVerification } from '@/domain/account/user/enterprise/entities/email-verification';
import { UniqueEmailVerificationCode } from '@/domain/account/user/enterprise/entities/value-object/unique-email-verification-code';
import { Prisma, VerificationCodes as PrismaEmailVerification } from '@prisma/client';

export class PrismaEmailVerificationMapper {
  static toDomain(raw: PrismaEmailVerification): EmailVerification {
    return EmailVerification.create(
      {
        code: new UniqueEmailVerificationCode(raw.code),
        userId: new UniqueEntityID(raw.userId),
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(emailVerification: EmailVerification): Prisma.VerificationCodesUncheckedCreateInput {
    return {
      id: emailVerification.id.toString(),
      code: emailVerification.code.toValue(),
      userId: emailVerification.userId.toString(),
      expiresAt: emailVerification.expiresAt,
      type: 'EMAIL',
      createdAt: emailVerification.createdAt,
      updatedAt: emailVerification.updatedAt,
    };
  }
}