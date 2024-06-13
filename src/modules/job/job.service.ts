import { Logger } from 'nestjs-pino';
import { EntityManager } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Jobs } from 'src/entities';
import { DbTypes } from '../database';
import { JobStartedEvent } from './types';
import { JOB_STARTED_EVENT } from './events';
import { InjectedClientId } from 'src/common/types';
import { EmptyRequest, InjectedApiKey } from 'src/common/types';
import { JobResponse, mapJobToJobResponse } from './response.types';
import { ActivationService } from 'src/common/services/activation.service';

@Injectable()
export class JobService {
  constructor(
    private readonly logger: Logger,
    private readonly client: EventEmitter2,
    private readonly moduleRef: ModuleRef,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly activationService: ActivationService,
  ) {
    this.activationService.initialize(this.redisService);
  }

  async createJob(
    dto: InjectedApiKey<InjectedClientId<EmptyRequest>>,
  ): Promise<JobResponse> {
    await this.checkForActivation(dto.apiKey);

    const manager = this.loadEntityManager();

    const job = new Jobs();
    job.clientId = dto.clientId;
    job.timestamp = Date.now().toString();

    await manager.save(job);

    this.logger.log(
      `Throwing JOB_STARTED_EVENT with dto: ${JSON.stringify({
        clientId: dto.clientId,
      })}`,
    );
    this.client.emit(JOB_STARTED_EVENT, {
      clientId: dto.clientId,
    } as JobStartedEvent);

    return mapJobToJobResponse(job);
  }

  private loadEntityManager(): EntityManager {
    const currentHour = new Date().getHours();

    return this.moduleRef.get(
      getEntityManagerToken(
        `database-${
          currentHour >= 0 && currentHour < 12
            ? DbTypes.MIDDAY
            : DbTypes.MIDNIGHT
        }`,
      ),
      {
        strict: false,
      },
    );
  }

  private checkForActivation = async (key: string) => {
    const verificationKey = this.createJobCreateActivationKey(key);

    const verificationData = await this.activationService.canActivate(
      verificationKey,
      {
        duration: +this.configService.get('API_KEY_TTL'),
      },
    );

    if (verificationData.meta.ttl >= 0) {
      const errorMessage = `API_KEY_REFRESH_IN_${verificationData.meta.ttl}_SECONDS`;

      throw new HttpException(errorMessage, HttpStatus.TOO_MANY_REQUESTS);
    }
  };

  private createJobCreateActivationKey = (key: string) => `job:creation:${key}`;
}
