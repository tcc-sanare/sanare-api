import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EmailVerification, EmailVerificationProps } from "@/domain/account/user/enterprise/entities/email-verification";
import { UniqueEmailVerificationCode } from "@/domain/account/user/enterprise/entities/value-object/unique-email-verification-code";

export function makeEmailVerification(
  override?: Partial<EmailVerificationProps>,
): EmailVerification {
  const emailVerification = EmailVerification.create({
    userId: new UniqueEntityID(),
    code: new UniqueEmailVerificationCode(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    createdAt: new Date(),
    ...override
  });

  return emailVerification;
}