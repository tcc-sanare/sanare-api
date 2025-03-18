import { Either, left, right } from '@/core/either';
import { Account } from '../../enterprise/entities/account';
import { AccountRepository } from '../repositories/account-repository';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../../../cryptography/hash-generetor';

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
  profilePhoto: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
}

type CreateAccountUseCaseResponse = Either<
  null,
  {
    account: Account;
  }
>;

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: CreateAccountUseCaseRequest,
  ): Promise<CreateAccountUseCaseResponse> {
    const account = await Account.create({
      name: request.name,
      email: request.email,
      password: await this.hashGenerator.hash(request.password),
      isVerified: false,
      profilePhotoKey: null,
    });

    if (!account) {
      return left(null);
    }

    if (await this.accountRepository.findByEmail(account.email)) {
      return left(null);
    }

    await this.accountRepository.save(account);

    return right({
      account,
    });
  }
}
