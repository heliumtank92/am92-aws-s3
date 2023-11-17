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
import SdSdkError from './S3SdkError'
import { INVALID_GEN_PRESIGNED_URL_OPS_ERROR } from './ERRORS'

export default class S3Sdk {
  CONFIG: S3SdkConfig
  client: S3Client

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
  }

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

  async putObject(attrs: PutObjectProps): Promise<PutObjectData> {
    const {
      bucket = '',
      key = '',
      body,
      contentType,
      region = ''
    } = attrs || {}
    const { BUCKET } = this.CONFIG

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
    const objectUrl = `https://s3.${objectRegion}.amazonaws.com/${bucket}/${key}`

    const data: PutObjectData = {
      bucket: Bucket,
      key: Key,
      etag: ETag,
      objectUrl
    }
    return data
  }

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

  async generatePresignedUrl(
    attrs: GeneratePresignedUrlProps
  ): Promise<GeneratePresignedUrlData> {
    const { bucket = '', key = '', operation, expiryInSecs } = attrs || {}
    const { BUCKET, PRESIGNED_EXPIRY_IN_SECS } = this.CONFIG

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

    const data: GeneratePresignedUrlData = {
      bucket: Bucket,
      key: Key,
      presignedUrl
    }
    return data
  }
}
