import { ValidateForgotPasswordCodeUseCase } from '@/domain/account/user/application/use-cases/forgot-password/validate-forgot-password-code-use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Body, Controller, Post } from '@nestjs/common';
import z from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller('forgot-password/validate')
export class ValidateForgotPasswordCodeController {
  constructor(
    private validateForgotPasswordCodeUseCase: ValidateForgotPasswordCodeUseCase,
  ) {}

  @Post()
  async handle(@Body(bodyValidation) { email, code }: BodyDto) {
    const result = await this.validateForgotPasswordCodeUseCase
      .execute({
        code,
        email,
      })
      .then((res) => {
        if (res.isLeft()) {
          return false;
        }

        return res.value.valid;
      });

    return {
      valid: result,
    };
  }
}
