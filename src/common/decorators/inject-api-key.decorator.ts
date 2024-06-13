import {
  ExecutionContext,
  createParamDecorator,
  UnauthorizedException,
} from '@nestjs/common';

export const InjectApiKey = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.apiKey) {
      throw new UnauthorizedException();
    }

    return req.apiKey;
  },
);
