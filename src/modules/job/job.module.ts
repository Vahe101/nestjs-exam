import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobSnapshotService } from './job-snapshot.service';

@Module({
  controllers: [JobController],
  providers: [JobService, JobSnapshotService],
})
export class JobModule {}
