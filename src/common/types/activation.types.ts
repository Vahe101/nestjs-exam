export interface IActivateKeyMetadata {
  duration: number;
}

export interface IActivateKeyResponseMetadata {
  ttl: number;
}

export interface IActivateKeyResponse {
  isActive: boolean;
  meta: IActivateKeyResponseMetadata;
}
