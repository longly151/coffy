import { IsInt } from 'class-validator';

export class BillDetail {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;

  static stringify(){
    return JSON.stringify({ productId: 'number', quantity: 'number' });
  }
}
