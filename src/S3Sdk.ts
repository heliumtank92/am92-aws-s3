import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectAclCommand,
  PutObjectAclCommandInput
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { RequestPresigningArguments } from '@smithy/types'
import {
  DEFAULT_BODY_FORMAT,
  DeleteObjectData,
  DeleteObjectProps,
  GeneratePresignedUrlData,
  GeneratePresignedUrlProps,
  GetObjectData,
  GetObjectProps,
  PutObjectAclData,
  PutObjectAclProps,
  PutObjectData,
  PutObjectProps,
  S3SdkConfig
} from './TYPES'
import CONFIG from './CONFIG'
import { SdSdkError } from './S3SdkError'
import { INVALID_GEN_PRESIGNED_URL_OPS_ERROR } from './ERRORS'

/**
 * Class to execute S3 functionlities using AWS S3 Client
 *
 * @class
 */
export class S3Sdk {
  /**
   * Configurations used for S3Sdk
   */
  CONFIG: S3SdkConfig
  /**
   * AWS S3 Client instance
   */
  client: S3Client

  /**
   * Creates an instance of S3Sdk.
   *
   * @constructor
   * @param [config]
   */
  constructor(config?: S3SdkConfig) {
    const thisConfig = { ...CONFIG, ...config }
    const { CONNECTION_CONFIG } = thisConfig

    this.CONFIG = thisConfig
    this.client = new S3Client(CONNECTION_CONFIG || {})

    this.getObject = this.getObject.bind(this)
    this.putObject = this.putObject.bind(this)
    this.deleteObject = this.deleteObject.bind(this)

    this.getObjects = this.getObjects.bind(this)
    this.putObjects = this.putObjects.bind(this)
    this.deleteObjects = this.deleteObjects.bind(this)

    this.putObjectAcl = this.putObjectAcl.bind(this)
    this.generatePresignedUrl = this.generatePresignedUrl.bind(this)
  }

  /**
   * Retrieves objects from Amazon S3. To use `GET`, you must have `READ` access to the object.
   *
   * @async
   * @param attrs
   * @returns
   */
  async getObject(attrs: GetObjectProps): Promise<GetObjectData> {
    const { bucket = '', key = '', bodyFormat } = attrs || {}
    const { BUCKET } = this.CONFIG

    const Bucket: string = bucket || BUCKET || ''
    const Key: string = key || ''
    const params: GetObjectCommandInput = { Bucket, Key }
    const command = new GetObjectCommand(params)

    const response: GetObjectCommandOutput = await this.client
      .send(command)
      .catch(error => {
        throw new SdSdkError(error)
      })
    const { Body, ContentType } = response
    let body = undefined

    switch (bodyFormat) {
      case 'WebStream': {
        body = Body?.transformToWebStream()
        break
      }

      case 'Uint8Array': {
        body = await Body?.transformToByteArray()
        break
      }

      default: {
        body = await Body?.transformToString(bodyFormat || DEFAULT_BODY_FORMAT)
        break
      }
    }

    const data: GetObjectData = {
      bucket: Bucket,
      key: Key,
      body,
      contentType: ContentType
    }
    return data
  }

  /**
   * Adds an object to a bucket. You must have `WRITE` permissions on a bucket to add an object to it.
   *
   * @async
   * @param attrs
   * @returns
   */
  async putObject(attrs: PutObjectProps): Promise<PutObjectData> {
    const {
      bucket = '',
      key = '',
      body,
      contentType,
      region = ''
    } = attrs || {}
    const { BUCKET, CLOUDFRONT_URL } = this.CONFIG

    const Bucket: string = bucket || BUCKET || ''
    const Key: string = key || ''
    const params: PutObjectCommandInput = {
      Bucket,
      Key,
      Body: body,
      ContentType: contentType
    }
    const command = new PutObjectCommand(params)

    const response: PutObjectCommandOutput = await this.client
      .send(command)
      .catch(error => {
        throw new SdSdkError(error)
      })
    const { ETag } = response

    const objectRegion = this.CONFIG.CONNECTION_CONFIG?.region || region
    const objectUrl = _generateObjectUrl(objectRegion, Bucket, Key)
    const objectCloudFrontUrl = _generateObjectCloudfrontUrl(
      CLOUDFRONT_URL,
      Key
    )

    const data: PutObjectData = {
      bucket: Bucket,
      key: Key,
      etag: ETag,
      objectUrl,
      objectCloudFrontUrl
    }
    return data
  }

  /**
   * Removes an object from a bucket. You must have `WRITE` permissions on a bucket to remove an object from it.
   *
   * @async
   * @param attrs
   * @returns
   */
  async deleteObject(attrs: DeleteObjectProps): Promise<DeleteObjectData> {
    const { bucket = '', key = '' } = attrs || {}
    const { BUCKET } = this.CONFIG

    const Bucket: string = bucket || BUCKET || ''
    const Key: string = key || ''
    const params: DeleteObjectCommandInput = { Bucket, Key }
    const command = new DeleteObjectCommand(params)

    const response: DeleteObjectCommandOutput = await this.client
      .send(command)
      .catch(error => {
        throw new SdSdkError(error)
      })
    const { DeleteMarker } = response

    const data: DeleteObjectData = {
      bucket: Bucket,
      key: Key,
      isDeleted: DeleteMarker
    }
    return data
  }

  /**
   * Retrieves multiple objects from Amazon S3.
   *
   * @async
   * @param attrs
   * @returns
   */
  async getObjects(
    attrs: Array<GetObjectProps>
  ): Promise<Array<GetObjectData>> {
    const promises = (attrs || []).map(this.getObject)
    const responses = await Promise.allSettled(promises)

    const data: Array<GetObjectData> = []
    responses.forEach(response => {
      if (response.status === 'fulfilled') {
        const value = response.value as GetObjectData
        data.push(value)
      }
    })

    return data
  }

  /**
   * Adds multiple objects to a bucket.
   *
   * @async
   * @param attrs
   * @returns
   */
  async putObjects(
    attrs: Array<PutObjectProps>
  ): Promise<Array<PutObjectData>> {
    const promises = (attrs || []).map(this.putObject)
    const responses = await Promise.allSettled(promises)

    const data: Array<PutObjectData> = []
    responses.forEach(response => {
      if (response.status === 'fulfilled') {
        const value = response.value as PutObjectData
        data.push(value)
      }
    })

    return data
  }

  /**
   * Removes multiple objects from a bucket.
   *
   * @async
   * @param attrs
   * @returns
   */
  async deleteObjects(
    attrs: Array<DeleteObjectProps>
  ): Promise<Array<DeleteObjectData>> {
    const promises = (attrs || []).map(this.deleteObject)
    const responses = await Promise.allSettled(promises)

    const data: Array<DeleteObjectData> = []
    responses.forEach(response => {
      if (response.status === 'fulfilled') {
        const value = response.value as DeleteObjectData
        data.push(value)
      }
    })

    return data
  }

  /**
   * Sets the access control list (ACL) permissions for a new or existing object in an S3 bucket. You must have `WRITE_ACP` permission to set the `ACL` of an object.
   *
   * @async
   * @param attrs
   * @returns
   */
  async putObjectAcl(attrs: PutObjectAclProps): Promise<PutObjectAclData> {
    const { bucket = '', key = '', acl } = attrs || {}
    const { BUCKET } = this.CONFIG

    const Bucket: string = bucket || BUCKET || ''
    const Key: string = key || ''
    const ACL = acl
    const params: PutObjectAclCommandInput = { Bucket, Key, ACL }
    const command = new PutObjectAclCommand(params)

    await this.client.send(command).catch(error => {
      throw new SdSdkError(error)
    })

    const data: PutObjectAclData = {
      bucket: Bucket,
      key: Key,
      acl: ACL
    }
    return data
  }

  /**
   * Generates a presigned URL to retrieve or add an object.
   *
   * @async
   * @param attrs
   * @returns
   */
  async generatePresignedUrl(
    attrs: GeneratePresignedUrlProps
  ): Promise<GeneratePresignedUrlData> {
    const { bucket = '', key = '', operation, expiryInSecs } = attrs || {}
    const { BUCKET, PRESIGNED_EXPIRY_IN_SECS, CLOUDFRONT_URL } = this.CONFIG

    const Bucket: string = bucket || BUCKET || ''
    const Key: string = key || ''
    const params: GetObjectCommandInput | PutObjectCommandInput = {
      Bucket,
      Key
    }
    let command: GetObjectCommand | PutObjectCommand
    const options: RequestPresigningArguments = {
      expiresIn: expiryInSecs >= 0 ? expiryInSecs : PRESIGNED_EXPIRY_IN_SECS
    }

    switch (operation) {
      case 'GetObject': {
        command = new GetObjectCommand(params)
        break
      }

      case 'PutObject': {
        command = new PutObjectCommand(params)
        break
      }

      default:
        throw new SdSdkError({ operation }, INVALID_GEN_PRESIGNED_URL_OPS_ERROR)
    }

    const presignedUrl = await getSignedUrl(
      this.client,
      command,
      options
    ).catch(error => {
      throw new SdSdkError(error)
    })

    const objectRegion = this.CONFIG.CONNECTION_CONFIG?.region || ''
    const objectUrl = _generateObjectUrl(objectRegion, Bucket, Key)
    const objectCloudFrontUrl = _generateObjectCloudfrontUrl(
      CLOUDFRONT_URL,
      Key
    )

    let presignedCloudFrontUrl = ''
    if (objectCloudFrontUrl) {
      const presignedUrlParts = presignedUrl.split('?')
      const presignedQuery = presignedUrlParts[1] || ''
      presignedCloudFrontUrl = `${objectCloudFrontUrl}?${presignedQuery}`
    }

    const data: GeneratePresignedUrlData = {
      bucket: Bucket,
      key: Key,
      presignedUrl,
      presignedCloudFrontUrl,
      objectUrl,
      objectCloudFrontUrl
    }
    return data
  }
}

/** @ignore */
function _generateObjectUrl(
  region: string,
  bucket: string,
  key: string
): string {
  const keys = key.split('/')
  const keysSanitized = keys.map(key => {
    const keySanitized = encodeURIComponent(key).replaceAll('%20', '+')
    return keySanitized
  })

  const bucketHasDot = bucket.includes('.')
  const keySanitized = keysSanitized.join('/')

  if (bucketHasDot) {
    return `https://s3.${region}.amazonaws.com/${bucket}/${keySanitized}`
  } else {
    return `https://${bucket}.s3.${region}.amazonaws.com/${keySanitized}`
  }
}

/** @ignore */
function _generateObjectCloudfrontUrl(
  CLOUDFRONT_URL: string = '',
  key: string
): string {
  if (!CLOUDFRONT_URL) {
    return ''
  }

  const keys = key.split('/')
  const keysSanitized = keys.map(key => {
    const keySanitized = encodeURIComponent(key).replaceAll('%20', '+')
    return keySanitized
  })

  const keySanitized = keysSanitized.join('/')

  return `${CLOUDFRONT_URL}/${keySanitized}`
}
