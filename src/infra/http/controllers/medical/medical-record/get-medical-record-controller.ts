import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetMedicalRecordBySelfMonitorIdUseCase } from "@/domain/medical/application/use-cases/medical-record/get-medical-record-by-self-monitor-id";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicalRecordPresenter } from "@/infra/http/presenters/medical-record-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller('medical-record')
export class GetMedicalRecordController{
    constructor(
        private getMedicalRecordBySelfMonitor: GetMedicalRecordBySelfMonitorIdUseCase,
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
        
        const medicalRecord = await this.getMedicalRecordBySelfMonitor.execute({selfMonitorId: selfMonitor.id.toString()})
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.medicalRecord
        })

        return {
            medicalRecord: MedicalRecordPresenter.toHttp(medicalRecord)
        }
        
    }
}