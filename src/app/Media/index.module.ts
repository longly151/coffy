import { Module } from '@nestjs/common';
import { S3 } from '@plugins/S3.plugin';
import { MediaController } from './Controller/index.controller';
import { MediaService } from './Service/index.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, S3],
  exports: [MediaService]
})
export class MediaModule {}
