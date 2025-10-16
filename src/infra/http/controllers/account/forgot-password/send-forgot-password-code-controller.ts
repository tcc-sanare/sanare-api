import { SendForgotPasswordCodeUseCase } from "@/domain/account/user/application/use-cases/forgot-password/send-forgot-password-code-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Get, Post } from "@nestjs/common";
import z from "zod";

const bodySchema = z.object({
  email: z.string().email(),
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("forgot-password")
export class SendForgotPasswordCodeController {
  constructor (
    private sendForgotPasswordCodeUseCase: SendForgotPasswordCodeUseCase
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: BodyDto): Promise<void> {
    await this.sendForgotPasswordCodeUseCase.execute({
      email: body.email,
    });
  }
}