import { ObjectStorageClass } from '@aws-sdk/client-s3'
export { ObjectStorageClass }

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
   * CloudFront URL for the S3 bucket
   */
  CLOUDFRONT_URL?: string
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
 * Type definition of input props for [S3Sdk.getObject]{@link S3Sdk#getObject}
 *
 * @interface
 */
export interface GetObjectProps {
  /**
   * S3 bucket name
   */
  bucket?: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
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
export interface GetObjectData {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
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
 */
export interface PutObjectProps {
  /**
   * S3 bucket name
   */
  bucket?: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
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
 */
export interface PutObjectData {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
  /**
   * Entity tag for the uploaded object
   */
  etag?: string
  /**
   * HTTPS url of the uploaded object
   */
  objectUrl: string
  /**
   * CloudFront url of the uploaded object
   */
  objectCloudFrontUrl: string
}

/**
 * Type definition of input props for [S3Sdk.deleteObject]{@link S3Sdk#deleteObject}
 *
 * @interface
 */
export interface DeleteObjectProps {
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
 * Type definition of output props for [S3Sdk.deleteObject]{@link S3Sdk#deleteObject}
 *
 * @interface
 */
export interface DeleteObjectData {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
  /**
   * Flag to identify whether object was deleted or not
   */
  isDeleted?: boolean
}

/**
 * Type definition of input props for [S3Sdk.listObjectsV2]{@link S3Sdk#listObjectsV2}
 *
 * @interface
 */
export interface ListObjectsV2Props {
  /**
   * S3 bucket name
   */
  bucket?: string
  /**
   * Limits the response to keys that begin with the specified prefix.
   */
  prefix?: string
  /**
   * This indicates that the list is being continued on this bucket with a token.
   */
  continuationToken?: string
  /**
   * `startAfter` is where you want Amazon S3 to start listing from. Amazon S3 starts listing after this specified key. `startAfter` can be any key in the bucket.
   */
  startAfter?: string
  /**
   * A delimiter is a character that you use to group keys.
   */
  delimiter?: string
  /**
   * Encoding type used by Amazon S3 to encode object keys in the response.
   */
  encodingType?: 'url'
  /**
   * Sets the maximum number of keys returned in the response. Defaults to 1,000 key names which is the max limit.
   */
  maxKeys?: number
}

export interface S3Object {
  /**
   * S3 object key which includes full path with file extension.
   */
  key?: string
  /**
   * Creation date of the object.
   */
  lastModified?: Date
  /**
   * The entity tag is a hash of the object.
   */
  eTag?: string
  /**
   * Size in bytes of the object.
   */
  size?: number
  /**
   * The class of storage used to store the object.
   */
  storageClass?: ObjectStorageClass
}

/**
 * Type definition of output props for [S3Sdk.deleteObject]{@link S3Sdk#deleteObject}
 *
 * @interface
 */
export interface ListObjectsV2Data {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * Limits the response to keys that begin with the specified prefix.
   */
  prefix?: string
  /**
   * Flag inticating whether all results were returned or not.
   */
  isTruncated?: boolean
  /**
   * Metadata about each object returned.
   */
  contents?: S3Object[]
  /**
   * Sets the maximum number of keys returned in the response. Defaults to 1,000 key names which is the max limit.
   */
  maxKeys?: number
  /**
   * The number of keys returned with this request.
   */
  keyCount?: number
  /**
   * If `continuationToken` was sent with the request, it is included in the response to use for pagination of the list response.
   */
  continuationToken?: string
  /**
   * This is send when `isTruncated` is true, which means there are more keys in the bucket that can be listed. The next list requests can be continued with this.
   */
  nextContinuationToken?: string
  /**
   * If `startAfter` was sent with the request, it is included in the response.
   */
  startAfter?: string
}

/**
 * Type definition of input props for [S3Sdk.putObjectAcl]{@link S3Sdk#putObjectAcl}
 *
 * @interface
 */
export interface PutObjectAclProps {
  /**
   * S3 bucket name
   */
  bucket?: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
  /**
   * Type of ACL for the S3 object
   */
  acl: 'private' | 'public-read' | 'public-read-write'
}

/**
 * Type definition of output props for [S3Sdk.putObjectAcl]{@link S3Sdk#putObjectAcl}
 *
 * @interface
 */
export interface PutObjectAclData {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
  /**
   * Type of ACL for the S3 object
   */
  acl: 'private' | 'public-read' | 'public-read-write'
}

/**
 * Type definition of input props for [S3Sdk.generatePresignedUrl]{@link S3Sdk#generatePresignedUrl}
 *
 * @interface
 */
export interface GeneratePresignedUrlProps {
  /**
   * S3 bucket name
   */
  bucket?: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
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
 */
export interface GeneratePresignedUrlData {
  /**
   * S3 bucket name
   */
  bucket: string
  /**
   * S3 object key which includes full path with file extension
   */
  key: string
  /**
   * Presigned URL
   */
  presignedUrl: string
  /**
   * CloudFront Presigned URL
   */
  presignedCloudFrontUrl: string
  /**
   * HTTPS url of the object
   */
  objectUrl: string
  /**
   * CloudFront url of the uploaded object
   */
  objectCloudFrontUrl: string
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
