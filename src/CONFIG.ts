import { DEFAULT_S3_SDK_CONFIG } from './TYPES'
import { IntConfigKeys, IntConfigs, S3SdkEnvConfig } from './TYPES_INTERNAL'

/** @ignore */
const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',

  S3_ENABLED = 'false',
  S3_REGION = DEFAULT_S3_SDK_CONFIG.CONNECTION_CONFIG.region,
  S3_BUCKET = '',
  S3_PRESIGNED_EXPIRY_IN_SECS = DEFAULT_S3_SDK_CONFIG.PRESIGNED_EXPIRY_IN_SECS.toString()
} = process.env

/** @ignore */
export const SERVICE = `${pkgName}@${pkgVersion}`

/** @ignore */
const ENABLED = S3_ENABLED === 'true'

/** @ignore */
const REQUIRED_CONFIG: Array<string> = []

/** @ignore */
const MISSING_CONFIGS: Array<string> = []

/** @ignore */
const INT_ENV: IntConfigs<string> = {
  S3_PRESIGNED_EXPIRY_IN_SECS
}

/** @ignore */
const INT_CONFIG: IntConfigs<number> = {}

/** @ignore */
const INVALID_INT_CONFIG: IntConfigs<string> = {}

if (ENABLED) {
  REQUIRED_CONFIG.push('S3_BUCKET')

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIGS.push(key)
    }
  })

  if (MISSING_CONFIGS.length) {
    const logFunc = console.fatal || console.error
    logFunc(
      `[${SERVICE} Otp] Otp Configs Missing: ${MISSING_CONFIGS.join(', ')}`
    )
    process.exit(1)
  }
}

Object.keys(INT_ENV).forEach(key => {
  const configKey = key as IntConfigKeys
  const value = INT_ENV[configKey] || ''
  const intValue = parseInt(value, 10)

  if (isNaN(intValue)) {
    INVALID_INT_CONFIG[configKey] = value
  } else {
    INT_CONFIG[configKey] = intValue
  }
})

if (Object.keys(INVALID_INT_CONFIG).length) {
  const logFunc = console.fatal || console.error
  logFunc(`[${SERVICE} Otp] Invalid Otp Integer Configs:`, INVALID_INT_CONFIG)
  process.exit(1)
}

/** @ignore */
const CONFIG: S3SdkEnvConfig = {
  ENABLED,
  CONNECTION_CONFIG: {
    region: S3_REGION || DEFAULT_S3_SDK_CONFIG.CONNECTION_CONFIG.region
  },
  BUCKET: S3_BUCKET,
  PRESIGNED_EXPIRY_IN_SECS:
    INT_CONFIG.S3_PRESIGNED_EXPIRY_IN_SECS ||
    DEFAULT_S3_SDK_CONFIG.PRESIGNED_EXPIRY_IN_SECS
}

export default CONFIG
