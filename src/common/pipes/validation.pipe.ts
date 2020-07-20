import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type
} from '@nestjs/common';
import { getClientError } from '@src/core/utils/appHelper';

/**
 * Change Error Message (Apply for Error Code = 400)
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const error = await getClientError(metatype, value);
    if(error) {
      throw new BadRequestException(error);
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
