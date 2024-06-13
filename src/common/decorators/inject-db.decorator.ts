import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Connection, EntitySchema, Repository } from 'typeorm';
import { Inject, Injectable, Scope, Type } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

export const InjectDb = <T>(entity: EntitySchema<T>) => {
  return function (target: any, key: string | symbol, index?: number) {
    Inject(getRepositoryToken(entity))(target, key, index);
  };
};

@Injectable({ scope: Scope.REQUEST })
export class DbProvider {
  private connection1: Connection;
  private connection2: Connection;

  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly configService: ConfigService,
    private readonly typeOrmModule: TypeOrmModule,
  ) {}

  public getRepository<T>(entity: Type<T>): Repository<T> {
    const hour = new Date().getHours();
    const connection = hour < 12 ? this.connection1 : this.connection2;
    return connection.getRepository(entity);
  }
}
