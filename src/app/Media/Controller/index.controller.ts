import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import _ from 'lodash';
import { MediaService } from '../Service/index.service';
import { S3DTO } from '../Dto/s3.dto';

@ApiTags('medias')
@Controller('medias')
export class MediaController {
  constructor(
    private readonly service: MediaService
  ) {}

  @Post()
  async getUrlStorage(@Body() s3Dto: S3DTO) {
    const presignedUrl = this.service.getUrlStorage(s3Dto);
    const url = _.split(presignedUrl, '?')[0];
    return { presignedUrl, url };
  }
}
