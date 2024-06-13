import { ApiProperty } from '@nestjs/swagger';
import { ApiKey } from 'src/entities';

export class ApiKeyResponse {
  @ApiProperty()
  value: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  clientId: string;
}

export const mapApiKeyToApiKeyResponse = (apiKey: ApiKey): ApiKeyResponse => ({
  value: apiKey.value,
  clientId: apiKey.clientId,
  expiresAt: apiKey.expiresAt,
});
