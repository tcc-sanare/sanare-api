import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { EmailVerificationRepository } from "../../repositories/email-verification-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface ValidateEmailVerificationUseCaseRequest {
  userId: string;
  verificationCode: string;
}

type ValidateEmailVerificationUseCaseResponse = Either<
  NotAllowedError<ValidateEmailVerificationUseCaseRequest>,
  {}
>;

@Injectable()
export class ValidateEmailVerificationUseCase {
  constructor(
    private emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async execute({
    userId,
    verificationCode,
  }: ValidateEmailVerificationUseCaseRequest): Promise<ValidateEmailVerificationUseCaseResponse> {
    const emailVerification = await this.emailVerificationRepository.findByUserId(userId);

    if (!emailVerification) {
      return left(new NotAllowedError<ValidateEmailVerificationUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: "Verificação de e-mail não encontrada",
          }
        ],
      }));
    }

    if (emailVerification.expiresAt < new Date()) {
      return left(new NotAllowedError<ValidateEmailVerificationUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: "Código de verificação expirado",
          }
        ],
      }));
    }

    if (emailVerification.code.toValue() !== verificationCode) {
      return left(new NotAllowedError<ValidateEmailVerificationUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: "Código de verificação inválido",
          }
        ],
      }));
    }

    await this.emailVerificationRepository.delete(emailVerification);

    return right({});
  }
}