import { Controller, Post, UseGuards } from "@nestjs/common";
import { GetAccount } from "../../decorators/get-account";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { CreateSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/create-self-monitor-use-case";
import { SelfMonitorPresenter } from "../../presenters/self-monitor-presenter";
import { AuthGuard } from "../../guards/auth-guard";

@Controller("self-monitor")
export class CreateSelfMonitorController {
    constructor(
        private createSelfMonitorUseCase: CreateSelfMonitorUseCase
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async handle(
        @GetAccount() account: Account
    ) {
        const result = await this.createSelfMonitorUseCase.execute({
            accountId: account.id
        })

        if(result.isLeft()){
            throw result.value 
        }

        return {
            selfMonitor: SelfMonitorPresenter.toHttp(result.value.selfMonitor)
        }
    }
}