import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UseCaseError } from "@/core/errors/use-case-error";
import { DeleteCaregiverRequestUseCase } from "@/domain/medical/application/use-cases/caregiver-request/delete-caregiver-request-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { Controller, Delete, Param, UseGuards } from "@nestjs/common";

@Controller("self-monitor/requests/:id")
export class CancelCaregiverRequestController {
  constructor (
    private deleteCaregiverRequestUseCase: DeleteCaregiverRequestUseCase,
  ) {}

  @Delete()
  @UseGuards(AuthGuard)
  async handle (
    @Param('id') requestId: string,
  ) {

    const result = await this.deleteCaregiverRequestUseCase.execute({
      caregiverRequestId: new UniqueEntityID(requestId),
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return { message: "Caregiver request cancelled successfully." };
  }
}