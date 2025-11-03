import { SendForgotPasswordCodeUseCase } from "@/domain/account/user/application/use-cases/forgot-password/send-forgot-password-code-use-case";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Query, Controller, Get } from "@nestjs/common";
import z from "zod";

const querySchema = z.object({
  email: z.string().email(),
});

type QueryDto = z.infer<typeof querySchema>;

const queryValidation = new ZodValidationPipe(querySchema);

@Controller("forgot-password")
export class SendForgotPasswordCodeController {
  constructor (
    private sendForgotPasswordCodeUseCase: SendForgotPasswordCodeUseCase
  ) {}

  @Get()
  async handle(@Query(queryValidation) query: QueryDto): Promise<void> {
    await this.sendForgotPasswordCodeUseCase.execute({
      email: query.email,
    });
  }
}