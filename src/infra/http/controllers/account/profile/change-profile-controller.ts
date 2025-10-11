import { ChangeProfileUseCase } from "@/domain/account/user/application/use-cases/profile/change-profile-use-case";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Put, UseGuards } from "@nestjs/common";
import z from "zod";

const bodySchema = z.object({
    profile: z.enum(["caregiver", "user"])
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("profile")
export class ChangeProfileController {
    constructor (
        private changeProfileUseCase: ChangeProfileUseCase
    ) {}

    @Put()
    @UseGuards(AuthGuard)
    async handle (
        @Body(bodyValidation) { profile }: BodyDto,
        @GetAccount() account: Account
    ) {
        await this.changeProfileUseCase.execute({ accountId: account.id, profile });
    }
}