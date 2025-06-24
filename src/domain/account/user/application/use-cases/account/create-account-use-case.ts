import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { AccountRepository } from '../../repositories/account-repository';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../../../../cryptography/hash-generetor';
import { EmailAlreadyExistsError } from './errors/email-already-exists-error';
import { Encrypter } from '@/domain/account/cryptography/encrypter';

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateAccountUseCaseResponse = Either<
  EmailAlreadyExistsError,
  {
    account: Account;
    access_token: string;
  }
>;

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter
  ) {}

  async execute(
    request: CreateAccountUseCaseRequest,
  ): Promise<CreateAccountUseCaseResponse> {
    const account = Account.create({
      name: request.name,
      email: request.email,
      password: await this.hashGenerator.hash(request.password),
      isVerified: false,
      profilePhoto: null,
    });

    if (await this.accountRepository.findByEmail(account.email)) {
      return left(new EmailAlreadyExistsError(account.email));
    }

    await this.accountRepository.create(account);

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    });

    return right({
      account,
      access_token: accessToken
    });
  }
}
