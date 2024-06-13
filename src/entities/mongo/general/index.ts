import {
  ApiKeyUsageSnapshot,
  ApiKeyUsageSnapshotSchema,
} from './api-key-usage-snapshot.entity';
import { ApiKey, ApiKeySchema } from './api-key.entity';
import { JobSnapshot, JobSnapshotSchema } from './job-snapshot.entity';

export * from './api-key.entity';
export * from './job-snapshot.entity';
export * from './api-key-usage-snapshot.entity';

export const generalEntitiesMongo = [
  { name: ApiKey.name, schema: ApiKeySchema },
  { name: JobSnapshot.name, schema: JobSnapshotSchema },
  { name: ApiKeyUsageSnapshot.name, schema: ApiKeyUsageSnapshotSchema },
];
