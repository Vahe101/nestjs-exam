import { Global, Module } from '@nestjs/common';
import { ApiKeyModule } from '../api-key/api-key.module';
import { ActivationService } from 'src/common/services/activation.service';

@Global()
@Module({
  imports: [ApiKeyModule],
  providers: [ActivationService],
  exports: [ApiKeyModule, ActivationService],
})
export class SharedModule {}
