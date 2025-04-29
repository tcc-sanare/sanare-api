import { EmailVerification } from "../../enterprise/entities/email-verification";
import { UniqueEmailVerificationCode } from "../../enterprise/entities/value-object/unique-email-verification-code";

export abstract class EmailVerificationRepository {
  abstract findById(id: string): Promise<EmailVerification | null>;
  abstract findByUserId(userId: string): Promise<EmailVerification | null>;
  abstract findByCode(code: UniqueEmailVerificationCode): Promise<EmailVerification | null>;
  abstract create(emailVerification: EmailVerification): Promise<void>;
  abstract save(emailVerification: EmailVerification): Promise<void>;
  abstract delete(emailVerification: EmailVerification): Promise<void>;
}