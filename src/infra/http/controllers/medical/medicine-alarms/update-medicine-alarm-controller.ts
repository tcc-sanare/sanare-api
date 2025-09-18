import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { UpdateMedicineAlarmUseCase } from "@/domain/medical/application/use-cases/medicine-alarm/update-medicine-alarm-use-case";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { MedicineAlarmPresenter } from "@/infra/http/presenters/medicine-alarm-presenter";
import { Body, Controller, Param, Put, UseGuards } from "@nestjs/common";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().transform(val => new UniqueEntityID(val))
});

type ParamsDTO = z.infer<typeof paramsSchema>;

const paramsValidation = new ZodValidationPipe(paramsSchema);

const bodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  weekdays: z.array(z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])).optional(),
  hours: z.array(z.number().min(0).max(24 * 60 - 1)).optional(),
  type: z.enum(["medicine", "medical-consultation"]).optional(),
  active: z.boolean().optional()
});

type BodyDTO = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("medicine-alarms/:id")
export class UpdateMedicineAlarmController {
  constructor (
    private updateMedicineAlarmUseCase: UpdateMedicineAlarmUseCase
  ) {};

  @Put()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account,
    @GetSelfMonitor() selfMonitor: SelfMonitor,
    @Param(paramsValidation) params: ParamsDTO,
    @Body(bodyValidation) body: BodyDTO
  ) {
    const { id } = params;
    const { name, weekdays, hours, type, active } = body;

    const result = await this.updateMedicineAlarmUseCase.execute({
      id,
      name,
      weekdays,
      hours,
      type,
      active,
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