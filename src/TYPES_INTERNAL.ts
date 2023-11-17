import { S3SdkConfig } from './TYPES'

/** @ignore */
export type IntConfigKeys = 'S3_PRESIGNED_EXPIRY_IN_SECS'

/** @ignore */
export type IntConfigs<T> = {
  [key in IntConfigKeys]?: T
}

/** @ignore */
export interface S3SdkEnvConfig extends S3SdkConfig {
  ENABLED: boolean
}
