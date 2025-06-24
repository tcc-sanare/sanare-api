import { UseCaseError } from "@/core/errors/use-case-error";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetCaregiverByCaregiverCodeUseCase } from "@/domain/medical/application/use-cases/caregiver/get-caregiver-by-caregiver-code-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { UpdateSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/update-self-monitor-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { CaregiverPresenter } from "@/infra/http/presenters/caregiver-presenter";
import { SelfMonitorPresenter } from "@/infra/http/presenters/self-monitor-presenter";
import { Controller, Post, Query, UseGuards } from "@nestjs/common";

@Controller('/self-monitor/caregiver')
export class ConnectCaregiverToSelfMonitorController{
    constructor(
        private updateSelfMonitor: UpdateSelfMonitorUseCase,
        private findSelfMonitor: GetSelfMonitorByAccountIdUseCase,
        private findCaregiverByCode: GetCaregiverByCaregiverCodeUseCase
    ) {}
    @Post()
    @UseGuards(AuthGuard)
    async handle(
        @Query('code') code: string,
        @GetAccount() account: Account
    ) {

        const caregiver = await this.findCaregiverByCode.execute({
            caregiverCode: code
        })
        .then(result => {
            if (result.isLeft()) throw new CustomHttpException(result.value)
            return result.value.caregiver
        })

        const selfMonitor =  await this.findSelfMonitor.execute({
            accountId: account.id
        })
        .then(result => {
            if (result.isLeft()) throw new CustomHttpException(result.value)
            return result.value.selfMonitor
        })

        if (selfMonitor.accountId.equals(caregiver.userId)) {
            throw new CustomHttpException(
                new UseCaseError({
                    statusCode: 400,
                    errors: [
                        {
                            message: 'Você não pode conectar seu perfil de monitoramento a si mesmo.',
                            path: ['selfMonitorId']
                        }
                    ]
                })
            )
        }

        const updateResult = await this.updateSelfMonitor.execute({
            selfMonitorId: selfMonitor.id.toString(),
            caregiverId: caregiver.id.toString()
        })
        .then(result => {
            if (result.isLeft()) throw new CustomHttpException(result.value)
            return result.value.selfMonitor
        })

        return {
            caregiver: CaregiverPresenter.toHttp(caregiver),
        }

    }
}

