import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { IActivateKeyMetadata, IActivateKeyResponse } from '../types';

@Injectable()
export class ActivationService {
  private redisClient: Redis;

  public initialize(redisService: RedisService) {
    if (!this.redisClient) {
      this.redisClient = redisService.getClient();
    }
  }

  public async canActivate(
    key: string,
    meta: IActivateKeyMetadata,
  ): Promise<IActivateKeyResponse> {
    const activationKey = this.generateActivationKey(key);
    const ttl = await this.redisClient.ttl(activationKey);

    if (ttl >= 0) {
      return { isActive: true, meta: { ttl } };
    }

    await this.redisClient.set(
      activationKey,
      new Date().getTime(),
      'PX',
      meta.duration * 1000,
    );

    return { isActive: false, meta: { ttl: -1 } };
  }

  public getTTL(key: string): Promise<number> {
    return this.redisClient.ttl(this.generateActivationKey(key));
  }

  private generateActivationKey(key: string): string {
    return `activation:lock:${key}`;
  }
}
