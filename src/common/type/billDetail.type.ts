import { IsInt } from 'class-validator';

export class BillDetail {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;

  @IsInt()
  pricePerUnit: number;

  static stringify(){
    return JSON.stringify({ productId: 'number', quantity: 'number', pricePerUnit: 'number' });
  }
}
