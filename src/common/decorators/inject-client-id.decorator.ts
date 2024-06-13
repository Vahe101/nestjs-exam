import {
  ExecutionContext,
  createParamDecorator,
  UnauthorizedException,
} from '@nestjs/common';

export const InjectClientId = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.clientId) {
      throw new UnauthorizedException();
    }

    return req.clientId;
  },
);
