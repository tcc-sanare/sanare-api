import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UseCaseError } from "@/core/errors/use-case-error";
import { UpdateCaregiverRequestUseCase } from "@/domain/medical/application/use-cases/caregiver-request/update-caregiver-request-use-case";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { GetCaregiver } from "@/infra/http/decorators/get-caregiver";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CaregiverRequestPresenter } from "@/infra/http/presenters/caregiver-request-presenter";
import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
  accept: z.boolean(),
});

type BodySchema = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("caregiver/requests/:requestId")
export class RespondSelfMonitorRequestController {
  constructor(
    private updateCaregiverRequestUseCase: UpdateCaregiverRequestUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle(
    @GetCaregiver() caregiver: Caregiver,
    @Param("requestId") requestId: string,
    @Body(bodyValidation) body: BodySchema,
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

    const { accept } = body;

    const result = await this.updateCaregiverRequestUseCase.execute({
      caregiverRequestId: new UniqueEntityID(requestId),
      status: accept ? "accepted" : "rejected",
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      caregiverRequest: CaregiverRequestPresenter.toHTTP(result.value.caregiverRequest),
    };
  }
}