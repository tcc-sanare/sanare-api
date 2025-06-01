import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetMedicalRecordBySelfMonitorIdUseCase } from "@/domain/medical/application/use-cases/medical-record/get-medical-record-by-self-monitor-id";
import { UpdateMedicalRecordUseCase } from "@/domain/medical/application/use-cases/medical-record/update-medical-record-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicalRecordPresenter } from "@/infra/http/presenters/medical-record-presenter";
import { Body, Controller, Put, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

const bodySchema = z.object({
    // medicalRecordId: z.string(),
    bloodType: z.enum(['a-' , 'a+' , 'b-' , 'b+' , 'ab-' , 'ab+' , 'o-' , 'o+']).optional(),
    allergies: z.string().array().optional(),
    chronicDiseases: z.string().array().optional()

})

type bodyDto = z.infer<typeof bodySchema>
const bodyValidationPipe = new ZodValidationPipe(bodySchema)
@Controller('medical-record')
export class UpdateMedicalRecordController{
    constructor(
        private updateMedicalRecord: UpdateMedicalRecordUseCase,
        private getMedicalRecordBySelfMonitor: GetMedicalRecordBySelfMonitorIdUseCase,
        private getSelfMonitor: GetSelfMonitorByAccountIdUseCase
    ) {}
    @Put()
    @UseGuards(AuthGuard)
    async handle(
        @GetAccount() account: Account,
        @Body(bodyValidationPipe) data: bodyDto
    ) {
        const selfMonitor = await this.getSelfMonitor.execute({accountId: account.id})
        .then(res => {
            if (res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.selfMonitor
        })

        const medicalRecord = await this.getMedicalRecordBySelfMonitor.execute({
            selfMonitorId: selfMonitor.id.toString()
        })
        .then(res => {
            if (res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.medicalRecord
        })

        const updatedMedicalRecord = await this.updateMedicalRecord.execute({
            medicalRecordId: medicalRecord.id.toString(),
            bloodType: data?.bloodType,
            allergies: data?.allergies,
            chronicDiseases: data?.chronicDiseases
        })
        .then(res => {
            if (res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.medicalRecord
        })
        return {
            medicalRecord: MedicalRecordPresenter.toHttp(updatedMedicalRecord)
        }
    }
}