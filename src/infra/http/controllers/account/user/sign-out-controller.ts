import { DeleteDeviceUseCase } from "@/domain/account/user/application/use-cases/device/delete-device-use-case";
import { GetDeviceByTokenUseCase } from "@/domain/account/user/application/use-cases/device/get-device-by-token-use-case";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";

const bodySchema = z.object({
  notificationToken: z.string()
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller('auth/sign-out')
export class SignOutController {
  constructor (
    private getDeviceByTokenUseCase: GetDeviceByTokenUseCase,
    private deleteDeviceUseCase: DeleteDeviceUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle (
    @Body(bodyValidation) body: BodyDto,
    @GetAccount() account: Account
  ) {
    const device = await this.getDeviceByTokenUseCase.execute({
      token: body.notificationToken
    });

    if (device) {
      await this.deleteDeviceUseCase.execute({
        token: body.notificationToken,
        userId: account.id.toString()
      });
    }
  }
}