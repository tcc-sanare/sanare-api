import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { DeleteMedicineAlarmUseCase } from "@/domain/medical/application/use-cases/medicine-alarm/delete-medicine-alarm-use-case";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().transform(val => new UniqueEntityID(val))
});

type ParamsDTO = z.infer<typeof paramsSchema>;

const paramsValidation = new ZodValidationPipe(paramsSchema);

@Controller("medicine-alarms/:id")
export class DeleteMedicineAlarmController {
  constructor (
    private deleteMedicineAlarmUseCase: DeleteMedicineAlarmUseCase
  ) {};

  @Delete()
  @UseGuards(AuthGuard)
  async handle (
    @GetAccount() account: Account,
    @GetSelfMonitor() selfMonitor: SelfMonitor,
    @Param(paramsValidation) params: ParamsDTO
  ) {
    const { id } = params;

    const result = await this.deleteMedicineAlarmUseCase.execute({
      id,
      selfMonitorId: selfMonitor.id
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return;
  }
}