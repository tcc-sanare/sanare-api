import { UseCaseError } from "@/core/errors/use-case-error";
import { GetCaregiverRequestsByCaregiverUseCase } from "@/domain/medical/application/use-cases/caregiver-request/get-caregiver-requests-by-caregiver-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { CaregiverRequestPresenter } from "@/infra/http/presenters/caregiver-request-presenter";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("caregiver/requests")
export class GetSelfMonitorRequestsController {
  constructor (
    private getCaregiverRequestsByCaregiverUseCase: GetCaregiverRequestsByCaregiverUseCase,
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
      caregiverRequests: result.value.caregiverRequests.map(CaregiverRequestPresenter.toHTTP)
    };
  }
}