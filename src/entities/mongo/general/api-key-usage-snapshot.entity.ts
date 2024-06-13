import { Index } from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoModel } from '../base-mongo.entity';

@Schema()
@Index(['apiKey'])
export class ApiKeyUsageSnapshot extends BaseMongoModel {
  @Prop()
  apiKey: string;

  @Prop()
  route: string;

  @Prop()
  timestamp: string;
}

export const ApiKeyUsageSnapshotSchema =
  SchemaFactory.createForClass(ApiKeyUsageSnapshot);
