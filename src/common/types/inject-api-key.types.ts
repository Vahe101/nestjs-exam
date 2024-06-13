export type InjectedClientId<T> = T & {
  clientId: string;
};

export type InjectedApiKey<T> = T & {
  apiKey: string;
};
