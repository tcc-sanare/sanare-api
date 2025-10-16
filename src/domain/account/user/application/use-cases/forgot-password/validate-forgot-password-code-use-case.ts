import { Either, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../../repositories/account-repository";
import { ForgotPasswordRepository } from "../../repositories/forgot-password-repository";

interface ValidateForgotPasswordCodeUseCaseRequest {
  email: string;
  code: string;
}

type ValidateForgotPasswordCodeUseCaseResponse = Either<
  NotAllowedError<ValidateForgotPasswordCodeUseCaseRequest>,
  { valid: boolean }
>;

@Injectable()
export class ValidateForgotPasswordCodeUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private forgotPasswordRepository: ForgotPasswordRepository
  ) {}

  async execute({
    email,
    code,
  }: ValidateForgotPasswordCodeUseCaseRequest): Promise<ValidateForgotPasswordCodeUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      console.error(`Account with email ${email} not found.`);
      return right({ valid: false });
    }

    const forgotPassword = await this.forgotPasswordRepository.findByAccountId(
      account.id
    );

    if (!forgotPassword) {
      return right({ valid: false });
    }

    if (forgotPassword.code.toValue() !== code) {
      return right({ valid: false });
    }

    if (forgotPassword.expiresAt < new Date()) {
      return right({ valid: false });
    }

    return right({ valid: true });
  }
}