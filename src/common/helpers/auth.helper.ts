import { InjectedApiKey, InjectedClientId } from '../types';

export const ComposeAuthorizedDto = <T>(
  apiKey: string,
  clientId: string,
  dto: T,
): InjectedApiKey<InjectedClientId<T>> => ({
  ...dto,
  apiKey,
  clientId,
});
