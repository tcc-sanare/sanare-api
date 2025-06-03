import { Account } from "@/domain/account/user/enterprise/entities/account";
import { CreateMedicalRecordUseCase } from "@/domain/medical/application/use-cases/medical-record/create-medical-record-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { MedicalRecordPresenter } from "@/infra/http/presenters/medical-record-presenter";

const bodySchema = z.object({
    bloodType: z.enum(['a-' , 'a+' , 'b-' , 'b+' , 'ab-' , 'ab+' , 'o-' , 'o+']),
    allergies: z.array(z.object({
        allergyId: z.string().uuid(),
        description: z.string().optional()
    })),
    chronicDiseases: z.string().array()
})

type BodyDto = z.infer<typeof bodySchema>
const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@Controller('medical-record')

export class CreateaMedicalRecordController{
    constructor(
        private createMedicalRecord: CreateMedicalRecordUseCase,
        private findSelfMonitorByAccountId: GetSelfMonitorByAccountIdUseCase
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async handle(
        @Body(bodyValidationPipe) data: BodyDto,
        @GetAccount() account: Account
    ) {
        const selfMonitor = await this.findSelfMonitorByAccountId.execute({
            accountId: account.id
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.selfMonitor
        })

        const result = await this.createMedicalRecord.execute({
            bloodType: data.bloodType,
            selfMonitorId: selfMonitor.id.toString(),
            allergies: data.allergies.map(allergy => ({
                allergyId: allergy.allergyId,
                description: allergy.description
            })),
            chronicDiseases: data.chronicDiseases
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.medicalRecord
        })

        return {
            medicalRecord: MedicalRecordPresenter.toHttp(result)
        }
    }
}
