// src/common/decorators/account.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSelfMonitor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.selfMonitor === undefined) throw Error("Get User Decorator should be used with Auth Guard")
    return request.selfMonitor; // Supondo que o `account` já foi adicionado ao request por um middleware ou guard
  },
);