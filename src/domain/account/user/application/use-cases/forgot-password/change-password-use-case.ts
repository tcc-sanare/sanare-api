import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { HashGenerator } from "@/domain/account/cryptography/hash-generetor";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../../repositories/account-repository";
import { ForgotPasswordRepository } from "../../repositories/forgot-password-repository";

interface ChangePasswordUseCaseRequest {
  email: string;
  code: string;
  newPassword: string;
}

type ChangePasswordUseCaseResponse = Either<
  NotAllowedError<ChangePasswordUseCaseRequest>,
  {}
>;

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private forgotPasswordRepository: ForgotPasswordRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    code,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      console.error(`Account with email ${email} not found.`);
      return right({});
    }

    const forgotPassword = await this.forgotPasswordRepository.findByAccountId(
      account.id
    );

    if (!forgotPassword) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "Código inválido"
          }
        ]
      }));
    }

    if (forgotPassword.code.toValue() !== code) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "Código inválido"
          }
        ]
      }));
    }

    if (forgotPassword.expiresAt < new Date()) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "Código expirado"
          }
        ]
      }));
    }

    account.password = await this.hashGenerator.hash(newPassword);
    await this.accountRepository.save(account);
    await this.forgotPasswordRepository.deleteByAccountId(account.id);

    return right({});
  }
}