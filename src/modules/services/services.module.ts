import { Global, Module } from '@nestjs/common';
// import { ApiKeyProvider } from './api-key-svc.options';

@Global()
@Module({
  providers: [],
  // providers: [ApiKeyProvider],
  exports: [],
  // exports: [ApiKeyProvider],
})
export class ServicesModule {}
