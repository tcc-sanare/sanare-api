import { AuthenticateAccountUseCase } from "@/domain/account/user/application/use-cases/account/authenticate-account-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string()
}).required();

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("auth/sign-in")
export class AuthenticateAccountController {
  constructor (
    private authenticateAccountUseCase: AuthenticateAccountUseCase
  ) {}

  @Post()
  async handle (
    @Body(bodyValidation) data: BodyDto
  ) {
    const result = await this.authenticateAccountUseCase.execute({
      email: data.email,
      password: data.password
    });

    if (result.isLeft()) {
      throw new CustomHttpException(result.value);
    }

    return {
      access_token: result.value.accessToken
    };
  }
}