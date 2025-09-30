import { UseCaseError } from "@/core/errors/use-case-error";
import { GetMyAccountUseCase } from "@/domain/account/user/application/use-cases/account/get-my-account-use-case";
import { GetCaregiverRequestsByCaregiverUseCase } from "@/domain/medical/application/use-cases/caregiver-request/get-caregiver-requests-by-caregiver-use-case";
import { GetSelfMonitorByIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-id-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { AccountPresenter } from "@/infra/http/presenters/account-presenter";
import { CaregiverRequestPresenter } from "@/infra/http/presenters/caregiver-request-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("caregiver/requests")
export class GetSelfMonitorRequestsController {
  constructor (
    private getCaregiverRequestsByCaregiverUseCase: GetCaregiverRequestsByCaregiverUseCase,
    private getSelfMonitorById: GetSelfMonitorByIdUseCase,
    private getAccountById: GetMyAccountUseCase
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(
    @GetCaregiver() caregiver: Caregiver
  ) {
    if (!caregiver) {
      throw new CustomHttpException(new UseCaseError({
        statusCode: 401,
        errors: [
          {
            message: "Unauthorized access. Caregiver not found.",
          },
        ],
      }));
    }

    const result = await this.getCaregiverRequestsByCaregiverUseCase.execute({
      caregiverId: caregiver.id,
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      caregiverRequests: await Promise.all(result.value.caregiverRequests.map(async caregiverRequest => {
        const selfMonitor = await this.getSelfMonitorById.execute({
          selfMonitorId: caregiverRequest.selfMonitorId.toString()
        }).then(res => {
          if (res.isLeft()) {
            throw new CustomHttpException(res.value);
          }

          return res.value.selfMonitor
        });

        const selfMonitorAccount = await this.getAccountById.execute({
          accountId: selfMonitor.accountId.toString()
        }).then(res => {
          if (res.isLeft()) {
            throw new CustomHttpException(res.value);
          }

          return res.value.account;
        });

        return {
          ...CaregiverRequestPresenter.toHTTP(caregiverRequest),
          account: await AccountPresenter.toHTTP(selfMonitorAccount)
        };
      })).then(res => res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    };
  }
}