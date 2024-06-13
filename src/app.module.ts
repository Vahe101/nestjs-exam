import { v4 as uuidv4 } from 'uuid';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { Environments } from './common/enums';
import { MainModule } from './modules/main.module';
import { controllers } from './modules/controllers';
import { DatabaseModule } from './modules/database';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    MainModule,
    SharedModule,
    DatabaseModule,
    AsyncHooksModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 1,
          ttl: 60 * 60,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          name: 'API',
          level:
            configService.get<Environments>('NODE_ENV') !==
            Environments.PRODUCTION
              ? 'debug'
              : 'info',
          genReqId: () => {
            const asyncHook: AsyncContext = AsyncContext.getInstance();
            const id = uuidv4();
            asyncHook.register();
            asyncHook.set('reqId', id);
            return id;
          },
          messageKey: 'msg_api_result',
          serializers: {
            req() {
              return null;
            },
            res() {
              return null;
            },
          },
        },
        forRoutes: controllers,
        exclude: [],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
