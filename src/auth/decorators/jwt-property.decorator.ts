import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtProperty = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
  },
);
