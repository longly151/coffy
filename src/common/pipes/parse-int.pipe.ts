/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata
} from '@nestjs/common';

/**
 * Use for validate Params Ex: /users/:id
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
