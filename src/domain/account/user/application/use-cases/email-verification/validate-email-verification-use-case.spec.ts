import { makeEmailVerification } from "test/factories/make-email-verification";
import { InMemoryEmailVerificationRepository } from "test/repositories/in-memory-email-verification-repository";
import { ValidateEmailVerificationUseCase } from "./validate-email-verification-use-case";

describe('ValidateEmailVerificationUseCase', () => {
  let sut: ValidateEmailVerificationUseCase;
  let inMemoryEmailVerificationRepository: InMemoryEmailVerificationRepository;

  beforeEach(() => {
    inMemoryEmailVerificationRepository = new InMemoryEmailVerificationRepository();
    sut = new ValidateEmailVerificationUseCase(inMemoryEmailVerificationRepository);
  });

  it('should be able to validate an email verification', async () => {
    const emailVerification = makeEmailVerification();

    await inMemoryEmailVerificationRepository.create(emailVerification);

    const result = await sut.execute({
      userId: emailVerification.userId.toString(),
      verificationCode: emailVerification.code.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryEmailVerificationRepository.items.length).toEqual(0);
  });

  it('should not be able to validate an email verification if it does not exist', async () => {
    const emailVerification = makeEmailVerification();

    await inMemoryEmailVerificationRepository.create(emailVerification);

    const result = await sut.execute({
      userId: 'non-existing-user-id',
      verificationCode: emailVerification.code.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not be able to validate an email verification if the code is invalid', async () => {
    const emailVerification = makeEmailVerification();

    await inMemoryEmailVerificationRepository.create(emailVerification);

    const result = await sut.execute({
      userId: emailVerification.userId.toString(),
      verificationCode: 'invalid-code',
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not be able to validate an email verification if it is expired', async () => {
    const emailVerification = makeEmailVerification({
      expiresAt: new Date(Date.now() - 1000),
    });

    await inMemoryEmailVerificationRepository.create(emailVerification);

    const result = await sut.execute({
      userId: emailVerification.userId.toString(),
      verificationCode: emailVerification.code.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
  });
});