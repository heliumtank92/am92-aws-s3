/**
 * Type definition of S3Sdk Class Config
 *
 * @interface
 */
export interface S3SdkConfig {
  /**
   * S3 bucket name
   */
  BUCKET?: string
  /**
   * Presigned URL expiry in seconds
   */
  PRESIGNED_EXPIRY_IN_SECS?: number
  /**
   * Configurations for aws-sdk's S3Client class
   */
  CONNECTION_CONFIG?: {
    /**
     * AWS region of S3.
     *
     * Note: This value is read from `process.env.S3_REGION` if this key is not set in the object passed to S3Sdk Class.
     * @default "ap-south-1"
     */
    region: string
  }
}

/**
 * Default configuration for S3Sdk Class config
 */
export const DEFAULT_S3_SDK_CONFIG = {
  CONNECTION_CONFIG: {
    region: 'ap-south-1'
  },
  PRESIGNED_EXPIRY_IN_SECS: 300
}

/**
 * Type definition of default props to all S3Sdk methods
 *
 * @interface
 */
interface DefaultProps {
  /**
   * S3 bucket name
   */
  bucket?: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
}

/**
 * Type definition of default props of data returned from S3Sdk methods
 *
 * @interface
 */
interface DefaultData {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
}

/**
 * Type definition of input props for [S3Sdk.getObject]{@link S3Sdk#getObject}
 *
 * @interface
 * @extends {DefaultProps}
 */
export interface GetObjectProps extends DefaultProps {
  /**
   * Expected format of fetched object
   */
  bodyFormat?: 'WebStream' | 'Uint8Array' | BufferEncoding
}

/**
 * Type definition of output props for [S3Sdk.getObject]{@link S3Sdk#getObject}
 *
 * @interface
 * @extends {DefaultData}
 */
export interface GetObjectData extends DefaultData {
  /**
   * Fetched object
   */
  body?: ReadableStream<any> | Uint8Array | string
  /**
   * Fetched object's MIME type
   */
  contentType?: string
}

/**
 * Default format of object data for [S3Sdk.getObject]{@link S3Sdk#getObject}
 */
export const DEFAULT_BODY_FORMAT: BufferEncoding = 'base64'

/**
 * Type definition of input props for [S3Sdk.putObject]{@link S3Sdk#putObject}
 *
 * @interface
 * @extends {DefaultProps}
 */
export interface PutObjectProps extends DefaultProps {
  /**
   * Object to be uploaded
   */
  body?: string | Uint8Array | Blob | ReadableStream<any> | Buffer
  /**
   * MIME type of object to be uploaded
   */
  contentType?: string
  /**
   * AWS region of S3 bucket
   */
  region?: string
}

/**
 * Type definition of output props for [S3Sdk.putObject]{@link S3Sdk#putObject}
 *
 * @interface
 * @extends {DefaultData}
 */
export interface PutObjectData extends DefaultData {
  /**
   * Entity tag for the uploaded object
   */
  etag?: string
  /**
   * HTTPS url of the uploaded object
   */
  objectUrl: string
}

/**
 * Type definition of input props for [S3Sdk.deleteObject]{@link S3Sdk#deleteObject}
 *
 * @interface
 * @extends {DefaultProps}
 */
export interface DeleteObjectProps extends DefaultProps {}

/**
 * Type definition of output props for [S3Sdk.deleteObject]{@link S3Sdk#deleteObject}
 *
 * @interface
 * @extends {DefaultData}
 */
export interface DeleteObjectData extends DefaultData {
  /**
   * Flag to identify whether object was deleted or not
   */
  isDeleted?: boolean
}

/**
 * Type definition of input props for [S3Sdk.putObjectAcl]{@link S3Sdk#putObjectAcl}
 *
 * @interface
 * @extends {DefaultProps}
 */
export interface PutObjectAclProps extends DefaultProps {
  /**
   * Type of ACL for the S3 object
   */
  acl: 'private' | 'public-read' | 'public-read-write'
}

/**
 * Type definition of output props for [S3Sdk.putObjectAcl]{@link S3Sdk#putObjectAcl}
 *
 * @interface
 * @extends {DefaultData}
 */
export interface PutObjectAclData extends DefaultData {
  /**
   * Type of ACL for the S3 object
   */
  acl: 'private' | 'public-read' | 'public-read-write'
}

/**
 * Type definition of input props for [S3Sdk.generatePresignedUrl]{@link S3Sdk#generatePresignedUrl}
 *
 * @interface
 * @extends {DefaultProps}
 */
export interface GeneratePresignedUrlProps extends DefaultProps {
  /**
   * Object operation for which presigned URL is to be generated
   */
  operation: 'GetObject' | 'PutObject'
  /**
   * Expiry of the presigned URL in seconds
   */
  expiryInSecs: number
}

/**
 * Type definition of output props for [S3Sdk.generatePresignedUrl]{@link S3Sdk#generatePresignedUrl}
 *
 * @interface
 * @extends {DefaultData}
 */
export interface GeneratePresignedUrlData extends DefaultData {
  /**
   * Presigned URL
   */
  presignedUrl: string
  /**
   * HTTPS url of the object
   */
  objectUrl: string
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
