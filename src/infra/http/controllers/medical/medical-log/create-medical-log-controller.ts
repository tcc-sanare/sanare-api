import { Account } from "@/domain/account/user/enterprise/entities/account";
import { CreateMedicalLogUseCase } from "@/domain/medical/application/use-cases/medical-log/create-medical-log-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicalLogPresenter } from "@/infra/http/presenters/medical-log-presenter";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

const bodySchema = z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().optional(),
    mood: z.enum(['calm', 'happy', 'energized', 'angry', 'low-energy', 'disoriented', 'discouraged', 'anxious', 'mood-changes']).optional(),
    hydratation: z.number().optional(),
    bloodSugar: z.number().optional(),
    diseases: z.string().uuid().array().optional(),
    symptoms: z.string().uuid().array().optional()
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)
type BodyDto = z.infer<typeof bodySchema>

@Controller('medical-log')
export class CreateMedicalLogController {
    constructor(
        private createMedicalLog: CreateMedicalLogUseCase,
        private findSelfMonitorByAccountId: GetSelfMonitorByAccountIdUseCase
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async handle(
        @Body(bodyValidationPipe) body: BodyDto,
        @GetAccount() account: Account
    ){
        const selfMonitorId = await this.findSelfMonitorByAccountId.execute({
            accountId: account.id
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.selfMonitor
        })

        const result = await this.createMedicalLog.execute({
            bloodPressure: body.bloodPressure,
            bloodSugar: body.bloodSugar,
            heartRate: body.heartRate,
            hydratation: body.hydratation,
            mood: body.mood,
            symptoms: body.symptoms,
            diseases: body.diseases,

            selfMonitorId: selfMonitorId.id.toString()
        })
        .then(res => {
            if(res.isLeft()) throw new CustomHttpException(res.value)
            return res.value.medicalLog
        })

        return {
            medicalLog: MedicalLogPresenter.toHttp(result)
        }
    }
}