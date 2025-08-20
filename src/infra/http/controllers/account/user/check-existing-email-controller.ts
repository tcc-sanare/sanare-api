import { CheckExistingEmailUseCase } from "@/domain/account/user/application/use-cases/account/check-existing-email-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Post } from "@nestjs/common";
import z from "zod";

const bodySchema = z.object({
  email: z.string().email()
});

type BodyDTO = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("accounts/check-email")
export class CheckExistingEmailController {
  constructor(
    private checkExistingEmailUseCase: CheckExistingEmailUseCase
  ) {}

  @Post()
  async handle (
    @Body(bodyValidation) { email }: BodyDTO
  ) {
    const result = await this.checkExistingEmailUseCase.execute({
      email
    });

    if (result.isLeft()) {
      return { emailExists: false };
    }

    return result.value;
  }
}