import { IsOptional } from 'class-validator';

export class S3DTO {
  @IsOptional()
  type: string;

  @IsOptional()
  fileName: string;

  @IsOptional()
  folderPrefix: string;
}
