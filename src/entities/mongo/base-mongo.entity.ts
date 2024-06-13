import {
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BaseMongoModel {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: false })
  deletedAt: Date;
}
