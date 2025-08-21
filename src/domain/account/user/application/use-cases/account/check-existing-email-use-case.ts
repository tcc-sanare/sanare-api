import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../../repositories/account-repository";

interface CheckExistingEmailUseCaseRequest {
  email: string;
}

type CheckExistingEmailUseCaseResponse = Either<
  null,
  {
    emailExists: boolean;
  }
>;

@Injectable()
export class CheckExistingEmailUseCase {
  constructor (
    private accountRepository: AccountRepository
  ) {}

  async execute (
    {
      email
    }: CheckExistingEmailUseCaseRequest
  ): Promise<CheckExistingEmailUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(email);

    return right({
      emailExists: !!account
    });
  }
}