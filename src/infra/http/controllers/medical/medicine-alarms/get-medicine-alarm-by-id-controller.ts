import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { z } from "zod";
import { GetMedicineAlarmByIdUseCase } from "@/domain/medical/application/use-cases/medicine-alarm/get-medicine-alarm-by-id-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicineAlarmPresenter } from "@/infra/http/presenters/medicine-alarm-presenter";

const paramsSchema = z.object({
  id: z.string().transform(val => new UniqueEntityID(val))
});

type ParamsDTO = z.infer<typeof paramsSchema>;

const paramsValidation = new ZodValidationPipe(paramsSchema);

@Controller("medicine-alarms/:id")
export class GetMedicineAlarmByIdController {
  constructor (
    private getMedicineAlarmByIdUseCase: GetMedicineAlarmByIdUseCase
  ) {};

  @Get()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account,
    @GetSelfMonitor() selfMonitor: SelfMonitor,
    @Param(paramsValidation) params: ParamsDTO
  ) {
    const { id } = params;

    const result = await this.getMedicineAlarmByIdUseCase.execute({
      id,
      selfMonitorId: selfMonitor.id
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      medicineAlarm: MedicineAlarmPresenter.toHTTP(result.value.medicineAlarm)
    };
  }
}