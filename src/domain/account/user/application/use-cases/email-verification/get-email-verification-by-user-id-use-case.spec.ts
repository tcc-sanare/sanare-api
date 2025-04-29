import { makeEmailVerification } from "test/factories/make-email-verification";
import { InMemoryEmailVerificationRepository } from "test/repositories/in-memory-email-verification-repository";
import { EmailVerification } from "../../../enterprise/entities/email-verification";
import { GetEmailVerificationByUserIdUseCase } from "./get-email-verification-by-user-id-use-case";
import exp from "constants";
import { UniqueEmailVerificationCode } from "../../../enterprise/entities/value-object/unique-email-verification-code";

describe('GetEmailVerificationByUserIdUseCase', () => {
  let sut: GetEmailVerificationByUserIdUseCase;
  let inMemoryEmailVerificationRepository: InMemoryEmailVerificationRepository;

  beforeEach(() => {
    inMemoryEmailVerificationRepository = new InMemoryEmailVerificationRepository();
    sut = new GetEmailVerificationByUserIdUseCase(inMemoryEmailVerificationRepository);
  });

  it('should be able to create an email verification by user id if dont exists', async () => {

    const result = await sut.execute({
      userId: 'non-existing-user-id',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.emailVerification).toBeInstanceOf(EmailVerification);
    expect(result.value?.emailVerification.userId.toString()).toEqual('non-existing-user-id');
    expect(inMemoryEmailVerificationRepository.items[0].userId.toString()).toEqual('non-existing-user-id');
    expect(result.value.emailVerification.code.toValue().length).toEqual(6);
  });

  it('should be able to get an email verification by user id if exists', async () => {
    const emailVerification = makeEmailVerification({
      code: new UniqueEmailVerificationCode('123456'),
    });

    await inMemoryEmailVerificationRepository.create(emailVerification);

    const result = await sut.execute({
      userId: emailVerification.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.emailVerification).toBeInstanceOf(EmailVerification);
    expect(result.value?.emailVerification.userId.toString()).toEqual(emailVerification.userId.toString());
    expect(result.value?.emailVerification.code.toValue()).not.toEqual('123456');
  });
});