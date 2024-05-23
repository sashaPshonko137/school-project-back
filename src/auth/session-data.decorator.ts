import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionData = createParamDecorator((_, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().session);
