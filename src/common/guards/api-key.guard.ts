import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ApiKeyService } from 'src/modules/api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'] ?? req.query.api_key;

    const isKeyValid = await this.apiKeyService.isKeyValid(key);
    const apiKey = await this.apiKeyService.getApiKeyByKey(key);
    req.apiKey = apiKey.value;
    req.clientId = apiKey.clientId;

    return isKeyValid;
  }
}
