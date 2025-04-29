import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { EmailVerificationRepository } from "../../repositories/email-verification-repository";

interface ValidateEmailVerificationUseCaseRequest {
  userId: string;
  verificationCode: string;
}

type ValidateEmailVerificationUseCaseResponse = Either<
  null,
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
      return left(null);
    }

    if (emailVerification.expiresAt < new Date()) {
      return left(null);
    }

    if (emailVerification.code.toValue() !== verificationCode) {
      return left(null);
    }

    await this.emailVerificationRepository.delete(emailVerification);

    return right({});
  }
}