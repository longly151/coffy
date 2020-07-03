import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
  InternalServerErrorException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import * as _ from "lodash";

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

    const object = plainToClass(metatype, value);

    const errors = await validate(object);
    const returnError = [];
    if (_.has(value, "bulk")) {
      // Multiple create
      if (!_.isEmpty(errors)) {
        const singleItemErrors = errors[0].children[0].children;
        singleItemErrors.map((error: any) => {
          returnError.push(_.pick(error, ["constraints", "property"]));
        });
      }
    } else {
      // Single create
      errors.map((error: any) => {
        returnError.push(_.pick(error, ["constraints", "property"]));
      });
    }
    if (errors.length > 0) {
      throw new BadRequestException(returnError);
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
