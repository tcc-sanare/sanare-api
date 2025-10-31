import { GetProfileUseCase } from "@/domain/account/user/application/use-cases/profile/get-profile-use-case";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("profile")
export class GetProfileController {
    constructor (
        private getProfileUseCase: GetProfileUseCase
    ) {};

    @Get()
    @UseGuards(AuthGuard)
    async handle (
        @GetAccount() account: Account
    ) {
        const profile = await this.getProfileUseCase.execute({ accountId: account.id })
            .then(res => res.isRight() && res.value.profile);

        return {
            profile
        };
    }
}