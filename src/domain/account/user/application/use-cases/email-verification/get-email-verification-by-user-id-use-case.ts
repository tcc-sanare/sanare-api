import { Either, left, right } from "@/core/either";
import { EmailVerification } from "../../../enterprise/entities/email-verification";
import { Injectable } from "@nestjs/common";
import { EmailVerificationRepository } from "../../repositories/email-verification-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UniqueEmailVerificationCode } from "../../../enterprise/entities/value-object/unique-email-verification-code";

interface GetEmailVerificationByUserIdUseCaseRequest {
  userId: string;
}

type GetEmailVerificationByUserIdUseCaseResponse = Either<
  null,
  {
    emailVerification: EmailVerification;
  }
>;

@Injectable()
export class GetEmailVerificationByUserIdUseCase {
  constructor(
    private emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async execute({
    userId,
  }: GetEmailVerificationByUserIdUseCaseRequest): Promise<GetEmailVerificationByUserIdUseCaseResponse> {
    const emailVerification = await this.emailVerificationRepository.findByUserId(userId);
    if (!emailVerification) {
      const emailVerification = EmailVerification.create({
        userId: new UniqueEntityID(userId),
      });

      await this.emailVerificationRepository.create(emailVerification);

      return right({ emailVerification });
    }


    emailVerification.code = new UniqueEmailVerificationCode();

    await this.emailVerificationRepository.save(emailVerification);

    return right({ emailVerification });
  }
}