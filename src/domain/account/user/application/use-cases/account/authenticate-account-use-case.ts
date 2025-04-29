import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../../repositories/account-repository";
import { HashComparer } from "@/domain/account/cryptography/hash-comparer";
import { Encrypter } from "@/domain/account/cryptography/encrypter";

interface AuthenticateAccountUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateAccountUseCaseResponse = Either<
  null,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute(
    request: AuthenticateAccountUseCaseRequest,
  ): Promise<AuthenticateAccountUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(request.email);

    if (!account) {
      return left(null);
    }

    const isPasswordValid = await this.hashComparer.compare(
      request.password,
      account.password,
    );

    if (!isPasswordValid) {
      return left(null);
    }

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}