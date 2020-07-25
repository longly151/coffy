import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import _ from 'lodash';
import { getClientError } from '../../core/utils/appHelper';
import { BillDetail } from '../type/billDetail.type';

@ValidatorConstraint({ name: 'customText', async: true })
export class IsBillDetails implements ValidatorConstraintInterface {
  async validate(values: Array<BillDetail>): Promise<boolean> {
    let errors = [];
    await Promise.all(values.map(async (value: BillDetail) => {
      const error = await getClientError(BillDetail, value);
      errors.push(error);
    }));
    errors = _.compact(errors);
    if(!_.isEmpty(errors)) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} item must be an Object: ${BillDetail.stringify()}`;
  }
}
