import { CreateAccountUseCase } from "@/domain/account/user/application/use-cases/account/create-account-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).required().refine(data => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("auth/sign-up")
export class CreateAccountController {
  constructor (
    private createAccountUseCase: CreateAccountUseCase
  ) {}

  @Post()
  async handle (
    @Body(bodyValidation) data: BodyDto
  ) {
    const result = await this.createAccountUseCase.execute({
      email: data.email,
      name: data.name,
      password: data.password
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return;
  }
}