import { UseCaseError } from "@/core/errors/use-case-error";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { UpdateSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/update-self-monitor-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CaregiverPresenter } from "@/infra/http/presenters/caregiver-presenter";
import { SelfMonitorPresenter } from "@/infra/http/presenters/self-monitor-presenter";
import { Body, Controller, Post, Query, UseGuards } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
  logInputs: z.object({
    mood: z.boolean(),
    symptoms: z.boolean(),
    imc: z.boolean(),
    hydration: z.boolean(),
    bloodPressure: z.boolean(),
    bloodSugar: z.boolean()
  }).nullable().optional()
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller('/self-monitor/caregiver')
export class UpdateSelfMonitorController{
    constructor(
        private updateSelfMonitor: UpdateSelfMonitorUseCase,
        private findSelfMonitor: GetSelfMonitorByAccountIdUseCase,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async handle(
        @Body(bodyValidation) data: BodyDto,
        @GetAccount() account: Account
    ) {

        const selfMonitor =  await this.findSelfMonitor.execute({
            accountId: account.id
        })
        .then(result => {
            if (result.isLeft()) throw new CustomHttpException(result.value)
            return result.value.selfMonitor
        })

        const updatedSelfMonitor = await this.updateSelfMonitor.execute({
            selfMonitorId: selfMonitor.id.toString(),
            logInputs: {
              bloodPressure: data.logInputs.bloodPressure,
              bloodSugar: data.logInputs.bloodSugar,
              hydration: data.logInputs.hydration,
              imc: data.logInputs.imc,
              mood: data.logInputs.mood,
              symptoms: data.logInputs.symptoms,
            }
        })
        .then(result => {
            if (result.isLeft()) throw new CustomHttpException(result.value)
            return result.value.selfMonitor
        })

        return {
          selfMonitor: SelfMonitorPresenter.toHttp(updatedSelfMonitor)
        }

    }
}

