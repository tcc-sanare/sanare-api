import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetMedicalLogBySelfMonitorIdUseCase } from "@/domain/medical/application/use-cases/medical-log/get-medical-log-by-self-monitor-id-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicalLogPresenter } from "@/infra/http/presenters/medical-log-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller('medical-log')
export class GetMedicalLogsController{
    constructor(
        private getMedicalLogsBySelfMonitorId: GetMedicalLogBySelfMonitorIdUseCase,
        private getSelfMonitor: GetSelfMonitorByAccountIdUseCase
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async handle(
        @GetAccount() account: Account
    ) {
        const selfMonitor = await this.getSelfMonitor.execute({accountId: account.id})
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.selfMonitor
        })

        const medicalLogs = await this.getMedicalLogsBySelfMonitorId.execute({
            selfMonitorId: selfMonitor.id.toString()
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.medicalLogs
        })

        return {
            medicalLogs: medicalLogs.map(MedicalLogPresenter.toHttp)
        }
        
    }
}