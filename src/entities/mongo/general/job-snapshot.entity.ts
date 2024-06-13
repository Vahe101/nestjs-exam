import { Index } from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoModel } from '../base-mongo.entity';

@Schema()
@Index(['clientId', 'timestamp'], { unique: true })
export class JobSnapshot extends BaseMongoModel {
  @Prop()
  clientId: string;

  @Prop()
  timestamp: string;
}

export const JobSnapshotSchema = SchemaFactory.createForClass(JobSnapshot);
