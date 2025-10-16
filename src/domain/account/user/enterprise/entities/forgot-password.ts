import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UniqueForgotPasswordCode } from "./value-object/unique-forgot-password-code";
import { Optional } from "@/core/types/optional";

export interface ForgotPasswordProps {
  accountId: UniqueEntityID;
  code: UniqueForgotPasswordCode;
  expiresAt: Date;

  createdAt: Date;
  updatedAt?: Date;
}

export class ForgotPassword extends Entity<ForgotPasswordProps> {
  get accountId() {
    return this.props.accountId;
  }

  get code() {
    return this.props.code;
  }

  set code(code: UniqueForgotPasswordCode) {
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
    props: Optional<ForgotPasswordProps, "createdAt" | "code" | "expiresAt">,
    id?: UniqueEntityID,
  ) {
    const forgotPassword = new ForgotPassword(
      {
        ...props,
        code: props.code ?? new UniqueForgotPasswordCode(),
        expiresAt: props.expiresAt ?? new Date(Date.now() + 1000 * 60 * UniqueForgotPasswordCode.getExpireMinutes()), // 5 minutes
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityID(),
    );

    return forgotPassword;
  }
}