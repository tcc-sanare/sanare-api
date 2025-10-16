import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ForgotPassword } from "../../enterprise/entities/forgot-password";

export abstract class ForgotPasswordRepository {
  abstract create(forgotPassword: ForgotPassword): Promise<void>;
  abstract findByAccountId(accountId: UniqueEntityID): Promise<ForgotPassword | null>;
  abstract deleteByAccountId(accountId: UniqueEntityID): Promise<void>;
}