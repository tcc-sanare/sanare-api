import { Account } from "@/domain/account/user/enterprise/entities/account";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { AccountPresenter } from "@/infra/http/presenters/account-presenter";
import { CaregiverPresenter } from "@/infra/http/presenters/caregiver-presenter";
import { SelfMonitorPresenter } from "@/infra/http/presenters/self-monitor-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("account")
export class GetAccountController {
  
  @Get()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account,
    @GetSelfMonitor() selfMonitor: SelfMonitor | null,
    @GetCaregiver() caregiver: Caregiver | null
  ) {
    return {
      account: await AccountPresenter.toHTTP(account),
      selfMonitor: selfMonitor ? SelfMonitorPresenter.toHTTP(selfMonitor) : null,
      caregiver: caregiver ? CaregiverPresenter.toHttp(caregiver) : null
    };
  }
}