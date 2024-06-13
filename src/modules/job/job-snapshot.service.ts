import { Model } from 'mongoose';
import { Logger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { JobStartedEvent } from './types';
import { JobSnapshot } from 'src/entities';
import { JOB_STARTED_EVENT } from './events';
import { EmptyResponse } from 'src/common/types';

@Injectable()
export class JobSnapshotService {
  constructor(
    @InjectModel(JobSnapshot.name)
    private readonly jobSnapshotModel: Model<JobSnapshot>,
    private readonly logger: Logger,
  ) {}

  @OnEvent(JOB_STARTED_EVENT)
  async createJob(dto: JobStartedEvent): Promise<EmptyResponse> {
    const jobSnapshot = new this.jobSnapshotModel();
    jobSnapshot.clientId = dto.clientId;
    jobSnapshot.timestamp = Date.now().toString();
    this.logger.log(
      `Catch JOB_STARTED_EVENT with dto: ${JSON.stringify({
        clientId: dto.clientId,
      })}`,
    );
    await jobSnapshot.save();

    return {};
  }
}
