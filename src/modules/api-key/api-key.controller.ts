import { Controller, Get, Post } from '@nestjs/common';
import { ApiKeyResponse } from './response.types';
import { ApiKeyService } from './api-key.service';
import { GetApiKeyByClientRequest } from './request.types';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  getApiKey(dto: GetApiKeyByClientRequest): Promise<ApiKeyResponse> {
    return this.apiKeyService.getApiKey(dto);
  }

  @Post()
  createApiKey(): Promise<ApiKeyResponse> {
    return this.apiKeyService.createApiKey();
  }
}
