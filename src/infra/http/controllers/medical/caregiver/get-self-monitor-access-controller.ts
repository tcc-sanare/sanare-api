import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { GetSelfMonitorAccessUseCase } from "@/domain/medical/application/use-cases/caregiver/get-self-monitor-access-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import z from "zod";

const paramSchema = z.object({
  selfMonitorId: z.string().uuid().transform((id) => new UniqueEntityID(id)),
});

type ParamDto = z.infer<typeof paramSchema>;

const paramValidation = new ZodValidationPipe(paramSchema);

@Controller('caregiver/self-monitors/:selfMonitorId/access')
export class GetSelfMonitorAccessController {
  constructor(
    private getSelfMonitorAccessUseCase: GetSelfMonitorAccessUseCase
  ) {};

  @Get()
  @UseGuards(AuthGuard)
  async handle (
    @Param(paramValidation) { selfMonitorId }: ParamDto,
    @GetCaregiver() caregiver: Caregiver
  ) {
    return await this.getSelfMonitorAccessUseCase.execute({
      caregiverId: caregiver.id,
      selfMonitorId: selfMonitorId,
    }).then(result => {
      if (result.isLeft()) {
        throw new CustomHttpException(result.value);
      }

      const { accessToken, selfMonitorId } = result.value;

      return {
        accessToken,
        selfMonitorId: selfMonitorId.toString(),
      };
    });
  }
}