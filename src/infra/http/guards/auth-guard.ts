import { Encrypter } from '@/domain/account/cryptography/encrypter';
import { GetMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/get-my-account-use-case';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private encrypter: Encrypter,
    private getAccountByIdUseCase: GetMyAccountUseCase
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest();

    const authenticationHeader = request.headers.authentication;

    if (!authenticationHeader) {
      throw new UnauthorizedException("Token is invalid");
    }

    const token = authenticationHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("Token is invalid");
    }
    
    const { sub: accountId } = await this.encrypter.decrypt<{ sub: string }>(token);

    const result = await this.getAccountByIdUseCase.execute({
      accountId
    });

    if (result.isLeft()) {
      throw new UnauthorizedException("Token is invalid");
    }

    request.account = result.value.account;

    return true;
  }
}