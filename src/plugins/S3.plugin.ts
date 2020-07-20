import AWS, { S3 as AwsS3 } from 'aws-sdk';
import Config from 'config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3 {
  public s3: AwsS3;

  public bucket: string;

  public signedUrlExpireSeconds: number;

  constructor() {
    const s3Config = Config.get('s3');
    const accessKeyId = process.env.S3_ACCESS_KEY_ID || s3Config.accessKeyId;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || s3Config.secretAccessKey;
    const region = process.env.S3_REGION || s3Config.region;

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region
    });
    this.s3 = new AWS.S3();

    this.bucket = process.env.S3_BUCKET_NAME || s3Config.bucketName;
    this.signedUrlExpireSeconds = parseInt(process.env.S3_SIGNED_URL_TIMEOUT || s3Config.timeout, 10);
  }

  getUrlStorage(key, type) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: 'coffy-source',
      Key: key,
      ContentType: type,
      ACL: 'public-read',
      Expires: this.signedUrlExpireSeconds
    });
  }
}
