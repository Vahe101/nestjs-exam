import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  CREATE_API_KEY_LIMIT,
  CREATE_API_KEY_TTL_MS,
} from 'src/common/constants';
import { JobService } from './job.service';
import { JobResponse } from './response.types';
import { ApiKeyGuard } from 'src/common/guards';
import { ComposeAuthorizedDto } from 'src/common/helpers';
import { InjectApiKey, InjectClientId } from 'src/common/decorators';

@Controller('jobs')
@UseGuards(ApiKeyGuard, ThrottlerGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Throttle({
    default: { limit: CREATE_API_KEY_LIMIT, ttl: CREATE_API_KEY_TTL_MS },
  })
  @Post()
  createJob(
    @InjectApiKey()
    apiKey: string,
    @InjectClientId() clientId: string,
  ): Promise<JobResponse> {
    return this.jobService.createJob(
      ComposeAuthorizedDto(apiKey, clientId, {}),
    );
  }
}
