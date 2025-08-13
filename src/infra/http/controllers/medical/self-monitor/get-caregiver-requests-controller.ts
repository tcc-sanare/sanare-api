import { UseCaseError } from "@/core/errors/use-case-error";
import { GetCaregiverRequestBySelfMonitorUseCase } from "@/domain/medical/application/use-cases/caregiver-request/get-caregiver-request-by-self-monitor-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { GetSelfMonitor } from "@/infra/http/decorators/get-self-monitor";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { CaregiverRequestPresenter } from "@/infra/http/presenters/caregiver-request-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("self-monitor/caregiver-requests")
export class GetCaregiverRequestsController {
  constructor (
    private getCaregiverRequestsBySelfMonitorUseCase: GetCaregiverRequestBySelfMonitorUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle (
    @GetSelfMonitor() selfMonitor: SelfMonitor
  ) {
    if (!selfMonitor) {
      throw new CustomHttpException(new UseCaseError({
        statusCode: 401,
        errors: [
          {
            message: "Unauthorized access. SelfMonitor not found.",
          },
        ],
      }));
    }

    const result = await this.getCaregiverRequestsBySelfMonitorUseCase.execute({
      selfMonitorId: selfMonitor.id,
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      caregiverRequests: result.value.caregiverRequests.map(CaregiverRequestPresenter.toHTTP)
    };
  }

}