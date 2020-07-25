import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { getClientError } from '../../core/utils/appHelper';
import { BillDetail } from '../type/billDetail.type';

@ValidatorConstraint({ name: 'customText', async: true })
export class IsBillDetail implements ValidatorConstraintInterface {
  async validate(value: BillDetail): Promise<boolean> {
    const error = await getClientError(BillDetail, value);
    if(error) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an Object: ${BillDetail.stringify()}`;
  }
}
