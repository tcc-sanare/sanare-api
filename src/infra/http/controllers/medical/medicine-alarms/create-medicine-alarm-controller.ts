import { CreateMedicineAlarmUseCase } from "@/domain/medical/application/use-cases/medicine-alarm/create-medicine-alarm-use-case";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { MedicineAlarmPresenter } from "@/infra/http/presenters/medicine-alarm-presenter";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string(),
  weekdays: z.array(z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])),
  hours: z.array(z.number().min(0)),
  type: z.enum(["medicine", "medical-consultation"]),
  active: z.boolean()
});

type BodyDTO = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("medicine-alarms")
export class CreateMedicineAlarmController {
  constructor (
    private createMedicineAlarmUseCase: CreateMedicineAlarmUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle (
    @Body(bodyValidation) data: BodyDTO,
    @GetSelfMonitor() selfMonitor: SelfMonitor
  ) {
    const { name, weekdays, hours, type, active } = data;

    const medicineAlarm = await this.createMedicineAlarmUseCase.execute({
      selfMonitorId: selfMonitor.id,
      name,
      weekdays,
      hours,
      type,
      active
    }).then(res => res.isRight() && res.value.medicineAlarm);

    return { medicineAlarm: MedicineAlarmPresenter.toHTTP(medicineAlarm) };
  }
}