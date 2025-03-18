import { Either, left, right } from "@/core/either";
import { Account } from "../../enterprise/entities/account";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../repositories/account-repository";

interface UpdateMyAccountUseCaseRequest {
  accountId: string;
  name?: string;
  theme?: "LIGHT" | "DARK";
}

type UpdateMyAccountUseCaseResponse = Either<
  null,
  {
    account: Account;
  }
>;

@Injectable()
export class UpdateMyAccountUseCase {

  constructor (
    private accountRepository: AccountRepository,
  ) {};

  async execute (request: UpdateMyAccountUseCaseRequest): Promise<UpdateMyAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(request.accountId);

    if (!account) {
      return left(null);
    }

    account.name = request.name || account.name;
    account.theme = request.theme || account.theme;

    await this.accountRepository.save(account);

    return right({
      account,
    });
  }

};