import { Index } from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoModel } from '../base-mongo.entity';

@Schema()
@Index(['value'], { unique: true })
export class ApiKey extends BaseMongoModel {
  @Prop()
  clientId: string;

  @Prop()
  value: string;

  @Prop({ nullable: true })
  expiresAt: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
