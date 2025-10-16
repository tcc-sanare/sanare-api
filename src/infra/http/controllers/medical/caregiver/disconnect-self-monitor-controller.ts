import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DisconnectSelfMonitorFromCaregiverUseCase } from "@/domain/medical/application/use-cases/caregiver/disconnect-self-monitor-from-caregiver-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import z from "zod";

const paramsSchema = z.object({
  selfMonitorId: z.string().uuid().transform((id) => new UniqueEntityID(id)),
});

type ParamsDto = z.infer<typeof paramsSchema>;

const paramsValidation = new ZodValidationPipe(paramsSchema);

@Controller('caregiver/self-monitors/:selfMonitorId')
export class DisconnectSelfMonitorController {
  constructor(
    private disconnectSelfMonitorFromCaregiverUseCase: DisconnectSelfMonitorFromCaregiverUseCase
  ) {};

  @Delete()
  @UseGuards(AuthGuard)
  async handle (
    @Param(paramsValidation) { selfMonitorId }: ParamsDto,
    @GetCaregiver() caregiver: Caregiver
  ) {
    await this.disconnectSelfMonitorFromCaregiverUseCase.execute({
      caregiverId: caregiver.id,
      selfMonitorId: selfMonitorId,
    }).then(result => {
      if (result.isLeft()) {
        throw new CustomHttpException(result.value);
      }

      return;
    });
  }
}