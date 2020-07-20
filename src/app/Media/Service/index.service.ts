import { Injectable } from '@nestjs/common';
import { createSlug } from '@core/utils/helper';
import path from 'path';
import { S3 } from '@plugins/S3.plugin';
import moment from 'moment';

@Injectable()
export class MediaService {
  constructor(
    private s3: S3
  ) {}

  public getUrlStorage(payload) {
    const { type, fileName, folderPrefix } = payload;
    let name = '';
    let ext = '';
    if (fileName) {
      ext = path.parse(fileName).ext;
      name = path.parse(fileName).name;
    }
    name = `${createSlug(name) || 'untitled'}-${moment().format('YYYYMMDDHHmmssSS')}`;
    return this.s3.getUrlStorage(`${folderPrefix}/${name}${ext}`, type);
  }
}
