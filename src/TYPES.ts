export interface S3SdkConfig {
  BUCKET?: string
  PRESIGNED_EXPIRY_IN_SECS?: number
  /**
   * Configurations for aws-sdk's S3Client class.
   */
  CONNECTION_CONFIG?: {
    /**
     * AWS region of S3.
     *
     * Note: This value is read from `process.env.KMS_AWS_REGION` if this key is not set in the object passed to S3Sdk Class.
     * @default "ap-south-1"
     */
    region: string
  }
}

export const DEFAULT_S3_SDK_CONFIG = {
  CONNECTION_CONFIG: {
    region: 'ap-south-1'
  },
  PRESIGNED_EXPIRY_IN_SECS: 300
}

interface DefaultProps {
  bucket?: string
  key: string
}

interface DefaultData {
  bucket: string
  key: string
}

export interface GetObjectProps extends DefaultProps {
  bodyFormat?: 'WebStream' | 'Uint8Array' | BufferEncoding
}

export interface GetObjectData extends DefaultData {
  body?: ReadableStream<any> | Uint8Array | string
  contentType?: string
}

export const DEFAULT_BODY_FORMAT: BufferEncoding = 'base64'

export interface PutObjectProps extends DefaultProps {
  body?: string | Uint8Array | Blob | ReadableStream<any> | Buffer
  contentType?: string
  region?: string
}

export interface PutObjectData extends DefaultData {
  etag?: string
  objectUrl: string
}

export interface DeleteObjectProps extends DefaultProps {}

export interface DeleteObjectData extends DefaultData {
  isDeleted?: boolean
}

export interface PutObjectAclProps extends DefaultProps {
  acl: 'private' | 'public-read' | 'public-read-write'
}

export interface PutObjectAclData extends DefaultData {
  acl: 'private' | 'public-read' | 'public-read-write'
}

export interface GeneratePresignedUrlProps extends DefaultProps {
  operation: 'GetObject' | 'PutObject'
  expiryInSecs: number
}

export interface GeneratePresignedUrlData extends DefaultData {
  presignedUrl: string
}

/**
 * Type defination for error map to be passed to KmsErrorMap.
 *
 * @interface
 */
export interface S3SdkErrorMap {
  /**
   * Overriding message string for KmsError instance
   */
  message?: string
  /**
   * Overriding error code string for KmsError instance
   */
  errorCode?: string
  /**
   * Overriding HTTP status code for KmsError instance
   */
  statusCode?: number
}

declare global {
  /** @ignore */
  interface Console {
    success?(...data: any[]): void
    fatal?(...data: any[]): void
  }
}
