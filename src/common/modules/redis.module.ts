import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          config: {
            url: `redis://${configService.get<string>(
              'REDIS_HOST',
            )}:${+configService.get<string>('REDIS_PORT')}`,
            host: configService.get<string>('REDIS_HOST'),
            port: +configService.get<string>('REDIS_PORT'),
            retryDelay: 3000,
            retryAttempts: 100,
          },
        }),
        inject: [ConfigService],
      },
      true,
    ),
  ],
})
export class CustomRedisModule {}
