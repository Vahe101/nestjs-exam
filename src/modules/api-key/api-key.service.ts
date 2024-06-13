import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetApiKeyByKeyRequest,
  GetApiKeyByClientRequest,
} from './request.types';
import { ApiKey } from 'src/entities';
import { ApiKeyResponse, mapApiKeyToApiKeyResponse } from './response.types';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name)
    private readonly apiKeyModel: Model<ApiKey>,
  ) {}

  async getApiKey(dto: GetApiKeyByClientRequest): Promise<ApiKeyResponse> {
    const apiKey = await this.apiKeyModel.findOne({
      clientId: dto.clientId,
    });

    return mapApiKeyToApiKeyResponse(apiKey);
  }

  async getApiKeyByKey(dto: GetApiKeyByKeyRequest): Promise<ApiKeyResponse> {
    const apiKey = await this.apiKeyModel.findOne({
      key: dto.key,
    });

    return mapApiKeyToApiKeyResponse(apiKey);
  }

  async createApiKey(): Promise<ApiKeyResponse> {
    const value = uuidv4();
    const clientId = uuidv4();
    const apiKey = new this.apiKeyModel();

    apiKey.value = value;
    apiKey.expiresAt = null;
    apiKey.clientId = clientId;

    await apiKey.save();

    return mapApiKeyToApiKeyResponse(apiKey);
  }

  async isKeyValid(key: string): Promise<boolean> {
    const apiKey = await this.apiKeyModel.findOne({
      value: key,
    });

    return (
      apiKey &&
      (!apiKey.expiresAt ||
        (apiKey.expiresAt && apiKey.expiresAt.getTime() > Date.now()))
    );
  }
}
