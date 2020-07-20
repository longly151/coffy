import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { getClientError } from '../../core/utils/appHelper';
import { Multilingual } from '../type/multilingual.type';

@ValidatorConstraint({ name: 'customText', async: true })
export class IsMultilingual implements ValidatorConstraintInterface {
  async validate(value: Multilingual): Promise<boolean> {
    const error = await getClientError(Multilingual, value);
    if(error) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an Object: ${Multilingual.stringify()}`;
  }
}
