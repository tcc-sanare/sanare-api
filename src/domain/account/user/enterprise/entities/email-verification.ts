import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UniqueEmailVerificationCode } from "./value-object/unique-email-verification-code";
import { Optional } from "@/core/types/optional";

export interface EmailVerificationProps {
  userId: UniqueEntityID;
  code: UniqueEmailVerificationCode;
  expiresAt: Date;

  createdAt: Date;
  updatedAt?: Date;
}

export class EmailVerification extends Entity<EmailVerificationProps> {
  get userId() {
    return this.props.userId;
  }

  get code() {
    return this.props.code;
  }

  set code(code: UniqueEmailVerificationCode) {
    this.props.code = code;
    this.update();
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  set expiresAt(expiresAt: Date) {
    this.props.expiresAt = expiresAt;
    this.update();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<EmailVerificationProps, "createdAt" | "code" | "expiresAt">,
    id?: UniqueEntityID,
  ) {
    const emailVerification = new EmailVerification(
      {
        ...props,
        code: props.code ?? new UniqueEmailVerificationCode(),
        expiresAt: props.expiresAt ?? new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityID(),
    );

    return emailVerification;
  }
}