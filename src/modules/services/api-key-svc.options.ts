import {
  Transport,
  ClientProxyFactory,
  ClientProviderOptions,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const ApiKeyServiceName = 'api-keys-service';

// Didn't work but its also a good solution needs to check what was reason
// events were throwing but services couldn't catch them
export const ApiKeyServiceTransport: (
  configService: ConfigService,
) => ClientProviderOptions = (configService: ConfigService) => ({
  name: ApiKeyServiceName,
  transport: Transport.REDIS,
  options: {
    url: `redis://${configService.get<string>(
      'REDIS_HOST',
    )}:${+configService.get<string>('REDIS_PORT')}`,
    host: configService.get<string>('REDIS_HOST'),
    port: +configService.get<string>('REDIS_PORT'),
    retryDelay: 3000,
    retryAttempts: 100,
  },
});

export const ApiKeyProvider = {
  provide: ApiKeyServiceName,
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create(ApiKeyServiceTransport(configService));
  },
  inject: [ConfigService],
};
