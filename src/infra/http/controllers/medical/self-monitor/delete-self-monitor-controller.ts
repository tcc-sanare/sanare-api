import { UseCaseError } from "@/core/errors/use-case-error";
import { DeleteSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/delete-self-monitor-use-case";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { Controller, Delete, UseGuards } from "@nestjs/common";

@Controller("self-monitor")
export class DeleteSelfMonitorController {
  constructor (
    private deleteSelfMonitorUseCase: DeleteSelfMonitorUseCase
  ) {};

  @Delete()
  @UseGuards(AuthGuard)
  async handle (
    @GetSelfMonitor() selfMonitor: SelfMonitor
  ) {
    if (!selfMonitor) {
      throw new CustomHttpException(new UseCaseError({
        statusCode: 401,
        errors: [
          {
            message: "Perfil de auto-monitoramento não encontrado"
          }
        ]
      }))
    }
    await this.deleteSelfMonitorUseCase.execute({
      selfMonitorId: selfMonitor.id
    }).then(res => {
      if (res.isLeft()) {
        throw new CustomHttpException(res.value);
      }

      return;
    });
  }
}