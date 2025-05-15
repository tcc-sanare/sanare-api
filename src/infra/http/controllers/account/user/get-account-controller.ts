import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { AccountPresenter } from "@/infra/http/presenters/account-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("account")
export class GetAccountController {
  @Get()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account
  ) {
    return {
      account: AccountPresenter.toHttp(account)
    }
  }
}