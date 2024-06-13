import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entitiesMongo, entitiesPostgres } from '../../entities';

export enum DbTypes {
  MIDNIGHT = 'midnight',
  MIDDAY = 'midday',
}

const postgresqlConnections = [
  {
    name: () => `database-${DbTypes.MIDDAY}`,
    host: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_HOST_FIRST'),
    port: (configService: ConfigService) =>
      +configService.get<string>('POSTGRES_PORT_FIRST'),
    username: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_USER_FIRST'),
    password: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_PASSWORD_FIRST'),
    database: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_DB_FIRST'),
  },
  {
    name: () => `database-${DbTypes.MIDNIGHT}`,
    host: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_HOST_SECOND'),
    port: (configService: ConfigService) =>
      +configService.get<string>('POSTGRES_PORT_SECOND'),
    username: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_USER_SECOND'),
    password: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_PASSWORD_SECOND'),
    database: (configService: ConfigService) =>
      configService.get<string>('POSTGRES_DB_SECOND'),
  },
];

// In case of real application synchronize better to set false and use migrations
// for now it's easier to set true, because it's a one time test app
const getPostgresOrmConfig = (config) => ({
  type: 'postgres',
  retryDelay: 10000,
  synchronize: true,
  retryAttempts: 100,
  autoLoadEntities: true,
  entities: ['../../entities/postgres/**/*.entity{.ts,.js}'],
  ...config,
});

const postgresqlDynamicModules = postgresqlConnections.map((config) =>
  TypeOrmModule.forFeature([...entitiesPostgres], config.name()),
);

const dynamicModulesMongoose = MongooseModule.forFeature([...entitiesMongo]);

@Global()
@Module({
  imports: [
    ...postgresqlConnections.map((config) =>
      TypeOrmModule.forRootAsync({
        name: config.name(),
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const configs = {};

          Object.entries(config).forEach(([key, func]) => {
            Object.assign(configs, { [key]: func(configService) });
          });

          return {
            name: config.name(),
            ...getPostgresOrmConfig(configs),
          };
        },
        inject: [ConfigService],
      }),
    ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    dynamicModulesMongoose,
    ...postgresqlDynamicModules,
  ],
  exports: [...postgresqlDynamicModules, dynamicModulesMongoose],
})
export class DatabaseModule {}
