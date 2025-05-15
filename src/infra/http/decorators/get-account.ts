// src/common/decorators/account.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.account; // Supondo que o `account` já foi adicionado ao request por um middleware ou guard
  },
);