import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetMedicineAlarmsBySelfMonitorIdUseCase } from "@/domain/medical/application/use-cases/medicine-alarm/get-medicine-alarms-by-self-monitor-id-use-case";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicineAlarmPresenter } from "@/infra/http/presenters/medicine-alarm-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("medicine-alarms")
export class GetMedicineAlarmsController {
  constructor(
    private getMedicineAlarmsBySelfMonitorUseCase: GetMedicineAlarmsBySelfMonitorIdUseCase
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(
    @GetAccount() account: Account,
    @GetSelfMonitor() selfMonitor: SelfMonitor
  ) {
    const result = await this.getMedicineAlarmsBySelfMonitorUseCase.execute({
      selfMonitorId: selfMonitor.id
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      medicineAlarms: result.value.medicineAlarms.map(MedicineAlarmPresenter.toHTTP)
    };
  }
}