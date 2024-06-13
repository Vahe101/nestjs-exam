import { ApiProperty } from '@nestjs/swagger';
import { Jobs } from 'src/entities';

export class JobResponse {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  clientId: string;
}

export const mapJobToJobResponse = (job: Jobs): JobResponse => ({
  clientId: job.clientId,
  timestamp: job.timestamp,
});
