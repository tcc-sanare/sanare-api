import { UseCaseError } from "@/core/errors/use-case-error";
import { DeleteCaregiverUseCase } from "@/domain/medical/application/use-cases/caregiver/delete-caregiver-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { Controller, Delete, UseGuards } from "@nestjs/common";

@Controller("caregiver")
export class DeleteCaregiverController {
  constructor (
    private deleteCaregiverUseCase: DeleteCaregiverUseCase
  ) {}

  @Delete()
  @UseGuards(AuthGuard)
  async handle (
    @GetCaregiver() caregiver: Caregiver
  ) {
    if (!caregiver) {
      throw new CustomHttpException(new UseCaseError({
        statusCode: 401,
        errors: [
          {
            message: "Perfil de responsável não encontrado"
          }
        ]
      }))
    }
    await this.deleteCaregiverUseCase.execute({
      caregiverId: caregiver.id
    }).then(res => {
      if (res.isLeft()) {
        throw new CustomHttpException(res.value);
      }

      return;
    });
  }
}