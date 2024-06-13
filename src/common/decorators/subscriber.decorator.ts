import { SetMetadata } from '@nestjs/common';

export const KEY = 'EVENT_SUBSCRIBER';

export const Subscriber = (event: string): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    SetMetadata(KEY, { event, method: propertyKey })(
      target,
      propertyKey,
      descriptor,
    );
  };
};
