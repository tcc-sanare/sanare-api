import { ChangePasswordUseCase } from '@/domain/account/user/application/use-cases/forgot-password/change-password-use-case';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Body, Controller, Post } from '@nestjs/common';
import z from 'zod';

const bodySchema = z
  .object({
    code: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) {
        return null;
      }

      return true;
    },
    {
      message: 'As senhas não conferem',
      path: ['confirmPassword'],
    },
  );

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller('forgot-password')
export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

  @Post()
  async handle(@Body(bodyValidation) data: BodyDto) {
    await this.changePasswordUseCase.execute({
      code: data.code,
      email: data.email,
      newPassword: data.password,
    }).then(res => {
        if (res.isLeft()) {
            throw new CustomHttpException(res.value);
        }

        return;
    });
  }
}
