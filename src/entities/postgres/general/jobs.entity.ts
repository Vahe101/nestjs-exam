import { Column, Entity, Index } from 'typeorm';
import { BasePostgresModel } from '../base-postgres.entity';

@Entity('jobs')
@Index(['clientId'])
export class Jobs extends BasePostgresModel {
  @Column()
  clientId: string;

  @Column()
  timestamp: string;
}
