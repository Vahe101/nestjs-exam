import { Module } from '@nestjs/common';
import { JobModule } from './job/job.module';
import { CustomRedisModule } from 'src/common/modules';
import { ApiKeyModule } from './api-key/api-key.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [JobModule, ApiKeyModule, ServicesModule, CustomRedisModule],
})
export class MainModule {}
