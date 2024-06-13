import { IsString } from 'class-validator';

export class GetApiKeyByClientRequest {
  @IsString()
  clientId: string;
}

export class GetApiKeyByKeyRequest {
  @IsString()
  key: string;
}
